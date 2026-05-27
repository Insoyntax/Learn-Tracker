package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"learntracker/internal/config"
	"learntracker/internal/database"
	"learntracker/internal/response"

	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
)

// ── Structs untuk Request & Response ──────────────────────────────────────────

type SignupRequest struct {
	Name      string `json:"name"`
	Birthdate string `json:"birthdate"` // format: "YYYY-MM-DD"
	School    string `json:"school"`
	Username  string `json:"username"`
	Password  string `json:"password"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type UserDTO struct {
	ID        int     `json:"id"`
	Name      string  `json:"name"`
	Email     string  `json:"email"`
	Username  string  `json:"username"`
	Birthdate *string `json:"birthdate"`
	School    *string `json:"school"`
	XP        int     `json:"xp"`
	Level     int     `json:"level"`
}

type AuthResponse struct {
	Token string  `json:"token"`
	User  UserDTO `json:"user"`
}

// ── Handlers ─────────────────────────────────────────────────────────────────

// Register handles user sign up (POST /api/v1/auth/signup).
func Register(w http.ResponseWriter, r *http.Request) {
	var req SignupRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Format JSON tidak valid", nil)
		return
	}

	// Validasi data
	req.Username = strings.TrimSpace(req.Username)
	req.Name = strings.TrimSpace(req.Name)
	req.School = strings.TrimSpace(req.School)
	req.Password = strings.TrimSpace(req.Password)

	if req.Username == "" || req.Name == "" || req.Password == "" {
		response.Error(w, http.StatusBadRequest, "VALIDATION_ERROR", "Nama, Username, dan Password wajib diisi", nil)
		return
	}

	if len(req.Password) < 6 {
		response.Error(w, http.StatusBadRequest, "VALIDATION_ERROR", "Password minimal harus 6 karakter", nil)
		return
	}

	pool := database.GetPool()

	// Cek apakah username sudah terpakai
	var exists bool
	err := pool.QueryRow(context.Background(),
		"SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)", req.Username).Scan(&exists)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", "Gagal memeriksa username", nil)
		return
	}
	if exists {
		response.Error(w, http.StatusConflict, "USERNAME_TAKEN", "Username sudah digunakan oleh orang lain", nil)
		return
	}

	// Hash password menggunakan Bcrypt
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "HASH_ERROR", "Gagal mengamankan password", nil)
		return
	}

	// Parse Birthdate
	var birthdate *time.Time
	if req.Birthdate != "" {
		parsedDate, err := time.Parse("2006-01-02", req.Birthdate)
		if err == nil {
			birthdate = &parsedDate
		}
	}

	// Buat email dummy yang unik karena email di beberapa schema bernilai unik/tidak null
	dummyEmail := fmt.Sprintf("%s@learntracker.local", req.Username)

	// Simpan ke database
	var userID int
	err = pool.QueryRow(context.Background(),
		`INSERT INTO users (name, email, username, password_hash, birthdate, school, xp, level, current_streak)
		 VALUES ($1, $2, $3, $4, $5, $6, 0, 1, 0)
		 RETURNING id`,
		req.Name, dummyEmail, req.Username, string(hashedPassword), birthdate, req.School,
	).Scan(&userID)

	if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", fmt.Sprintf("Gagal mendaftarkan pengguna: %v", err), nil)
		return
	}

	// Kembalikan response sukses
	response.Success(w, http.StatusCreated, map[string]interface{}{
		"message": "Pendaftaran berhasil! Silakan login.",
		"userId":  userID,
	})
}

// Login handles credentials authentication (POST /api/v1/auth/login).
func Login(w http.ResponseWriter, r *http.Request) {
	// Ambil AUTH_SECRET dari config
	cfg := config.Load()
	if cfg.AuthSecret == "" {
		response.Error(w, http.StatusInternalServerError, "CONFIG_ERROR", "AUTH_SECRET tidak terkonfigurasi di server", nil)
		return
	}

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Format JSON tidak valid", nil)
		return
	}

	req.Username = strings.TrimSpace(req.Username)
	req.Password = strings.TrimSpace(req.Password)

	if req.Username == "" || req.Password == "" {
		response.Error(w, http.StatusBadRequest, "VALIDATION_ERROR", "Username dan Password wajib diisi", nil)
		return
	}

	pool := database.GetPool()

	// Cari user berdasarkan username
	var id int
	var name *string
	var email string
	var username string
	var passwordHash *string
	var birthdate *time.Time
	var school *string
	var xp int
	var level int

	err := pool.QueryRow(context.Background(),
		`SELECT id, name, email, username, password_hash, birthdate, school, xp, level 
		 FROM users WHERE username = $1`, req.Username,
	).Scan(&id, &name, &email, &username, &passwordHash, &birthdate, &school, &xp, &level)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			response.Error(w, http.StatusUnauthorized, "INVALID_CREDENTIALS", "Username atau Password salah", nil)
			return
		}
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", "Kesalahan saat mencari pengguna", nil)
		return
	}

	if passwordHash == nil || *passwordHash == "" {
		response.Error(w, http.StatusUnauthorized, "OAUTH_ONLY", "Akun ini didaftarkan menggunakan Google/GitHub. Silakan login menggunakan OAuth.", nil)
		return
	}

	// Cocokkan password hash
	err = bcrypt.CompareHashAndPassword([]byte(*passwordHash), []byte(req.Password))
	if err != nil {
		response.Error(w, http.StatusUnauthorized, "INVALID_CREDENTIALS", "Username atau Password salah", nil)
		return
	}

	// Generate HS256 JWT Token
	claims := jwt.MapClaims{
		"sub":   strconv.Itoa(id),
		"name":  name,
		"email": email,
		"exp":   time.Now().Add(30 * 24 * time.Hour).Unix(), // 30 Hari
		"iat":   time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(cfg.AuthSecret))
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "TOKEN_ERROR", "Gagal menerbitkan token keamanan", nil)
		return
	}

	// Buat DTO response
	userNameStr := ""
	if name != nil {
		userNameStr = *name
	}

	var birthdateStr *string
	if birthdate != nil {
		formatted := birthdate.Format("2006-01-02")
		birthdateStr = &formatted
	}

	userDTO := UserDTO{
		ID:        id,
		Name:      userNameStr,
		Email:     email,
		Username:  username,
		Birthdate: birthdateStr,
		School:    school,
		XP:        xp,
		Level:     level,
	}

	// Set session cookie agar bisa langsung dibaca middleware
	http.SetCookie(w, &http.Cookie{
		Name:     "authjs.session-token",
		Value:    tokenString,
		Path:     "/",
		Expires:  time.Now().Add(30 * 24 * time.Hour),
		HttpOnly: false, // Samakan dengan frontend/auth.ts
		Secure:   false, // Set true jika di production
		SameSite: http.SameSiteLaxMode,
	})

	response.Success(w, http.StatusOK, AuthResponse{
		Token: tokenString,
		User:  userDTO,
	})
}
