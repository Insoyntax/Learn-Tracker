package handlers

import (
	"context"
	"encoding/json"
	"math"
	"net/http"
	"strconv"
	"strings"

	"learntracker/internal/database"
	"learntracker/internal/middleware"
	"learntracker/internal/models"
	"learntracker/internal/response"
	"learntracker/internal/sanitize"
)

// ─── Notes Handlers ─────────────────────────────────────────────────────────
// All handlers now extract the authenticated userId from the request context
// (injected by the JWT auth middleware) instead of using a hardcoded value.

// GetNotes lists notes with pagination, tag filtering, and search.
// Query params: ?page=1&limit=10&tags=go,sql&search=keyword
func GetNotes(w http.ResponseWriter, r *http.Request) {
	// Extract authenticated userId from JWT middleware context
	userID := middleware.UserIDFromContext(r.Context())
	pool := database.GetPool()

	// Parse pagination
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	if page < 1 {
		page = 1
	}
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	if limit < 1 || limit > 100 {
		limit = 10
	}
	offset := (page - 1) * limit

	// Build WHERE clauses
	where := []string{"user_id = $1"}
	args := []interface{}{userID}
	argIdx := 2

	// Tag filter: ?tags=go,sql
	if tagsParam := r.URL.Query().Get("tags"); tagsParam != "" {
		tags := strings.Split(tagsParam, ",")
		where = append(where, "$"+strconv.Itoa(argIdx)+"::text[] && tags") // overlap operator
		args = append(args, tags)
		argIdx++
	}

	// Search filter: ?search=keyword (full-text search on title + content)
	if search := r.URL.Query().Get("search"); search != "" {
		where = append(where, "to_tsvector('english', title || ' ' || content) @@ plainto_tsquery('english', $"+strconv.Itoa(argIdx)+")")
		args = append(args, search)
		argIdx++
	}

	whereClause := strings.Join(where, " AND ")

	// Count total items
	var totalItems int
	countQuery := "SELECT COUNT(*) FROM notes WHERE " + whereClause
	err := pool.QueryRow(context.Background(), countQuery, args...).Scan(&totalItems)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
		return
	}

	totalPages := int(math.Ceil(float64(totalItems) / float64(limit)))
	if totalPages < 1 {
		totalPages = 1
	}

	// Fetch paginated results
	dataQuery := "SELECT id, title, content, tags, user_id, created_at, updated_at FROM notes WHERE " +
		whereClause + " ORDER BY created_at DESC LIMIT $" + strconv.Itoa(argIdx) + " OFFSET $" + strconv.Itoa(argIdx+1)
	args = append(args, limit, offset)

	rows, err := pool.Query(context.Background(), dataQuery, args...)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
		return
	}
	defer rows.Close()

	notes := []models.Note{}
	for rows.Next() {
		var n models.Note
		if err := rows.Scan(&n.ID, &n.Title, &n.Content, &n.Tags, &n.UserID, &n.CreatedAt, &n.UpdatedAt); err != nil {
			response.Error(w, http.StatusInternalServerError, "SCAN_ERROR", err.Error(), nil)
			return
		}
		notes = append(notes, n)
	}

	response.SuccessPaginated(w, http.StatusOK, notes, page, totalPages, totalItems)
}

// CreateNote creates a new note with XSS sanitization.
// The userId is extracted from the JWT token in the request context.
func CreateNote(w http.ResponseWriter, r *http.Request) {
	// Extract authenticated userId from JWT middleware context
	userID := middleware.UserIDFromContext(r.Context())

	var input models.NoteCreate
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Invalid request body", nil)
		return
	}

	if strings.TrimSpace(input.Title) == "" {
		response.Error(w, http.StatusBadRequest, "VALIDATION_ERROR", "Title is required", nil)
		return
	}

	// XSS sanitization
	input.Content = sanitize.HTML(input.Content)

	if input.Tags == nil {
		input.Tags = []string{}
	}

	pool := database.GetPool()
	var n models.Note
	err := pool.QueryRow(context.Background(),
		`INSERT INTO notes (title, content, tags, user_id)
		 VALUES ($1, $2, $3, $4)
		 RETURNING id, title, content, tags, user_id, created_at, updated_at`,
		input.Title, input.Content, input.Tags, userID,
	).Scan(&n.ID, &n.Title, &n.Content, &n.Tags, &n.UserID, &n.CreatedAt, &n.UpdatedAt)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
		return
	}

	response.Success(w, http.StatusCreated, n)
}

// UpdateNote updates an existing note with XSS sanitization.
func UpdateNote(w http.ResponseWriter, r *http.Request) {
	// Extract authenticated userId from JWT middleware context
	userID := middleware.UserIDFromContext(r.Context())

	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid note ID", nil)
		return
	}

	var input models.NoteUpdate
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Invalid request body", nil)
		return
	}

	if strings.TrimSpace(input.Title) == "" {
		response.Error(w, http.StatusBadRequest, "VALIDATION_ERROR", "Title is required", nil)
		return
	}

	// XSS sanitization
	input.Content = sanitize.HTML(input.Content)

	if input.Tags == nil {
		input.Tags = []string{}
	}

	pool := database.GetPool()
	var n models.Note
	err = pool.QueryRow(context.Background(),
		`UPDATE notes SET title = $1, content = $2, tags = $3, updated_at = NOW()
		 WHERE id = $4 AND user_id = $5
		 RETURNING id, title, content, tags, user_id, created_at, updated_at`,
		input.Title, input.Content, input.Tags, id, userID,
	).Scan(&n.ID, &n.Title, &n.Content, &n.Tags, &n.UserID, &n.CreatedAt, &n.UpdatedAt)
	if err != nil {
		response.Error(w, http.StatusNotFound, "NOT_FOUND", "Note not found", nil)
		return
	}

	response.Success(w, http.StatusOK, n)
}

// DeleteNote deletes a note by ID.
func DeleteNote(w http.ResponseWriter, r *http.Request) {
	// Extract authenticated userId from JWT middleware context
	userID := middleware.UserIDFromContext(r.Context())

	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid note ID", nil)
		return
	}

	pool := database.GetPool()
	tag, err := pool.Exec(context.Background(),
		`DELETE FROM notes WHERE id = $1 AND user_id = $2`, id, userID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
		return
	}
	if tag.RowsAffected() == 0 {
		response.Error(w, http.StatusNotFound, "NOT_FOUND", "Note not found", nil)
		return
	}

	response.Success(w, http.StatusOK, map[string]string{"message": "Note deleted successfully"})
}
