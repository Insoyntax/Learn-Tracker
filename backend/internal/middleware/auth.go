package middleware

// ─── JWT Authentication Middleware ──────────────────────────────────────────
// This middleware verifies HS256 JWTs issued by the Next.js Auth.js v5 frontend.
//
// HOW IT WORKS:
// 1. Extracts the JWT from the Authorization header (Bearer <token>)
//    or falls back to reading the Auth.js session cookie.
// 2. Verifies the HS256 (HMAC-SHA256) signature using AUTH_SECRET —
//    the same secret configured in the Next.js frontend's auth.ts.
// 3. Extracts the "sub" claim (which contains the database user ID)
//    and injects it into the Go context.Context for use by handlers.
//
// SHARED SECRET:
// The AUTH_SECRET env var MUST be identical in both:
//   - frontend/.env.local  (used by Auth.js/jose to sign tokens)
//   - backend/.env         (used here by golang-jwt to verify tokens)
// ────────────────────────────────────────────────────────────────────────────

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"learntracker/internal/response"

	"github.com/golang-jwt/jwt/v5"
)

// RequireAuth creates an HTTP middleware that validates HS256 JWTs.
// authSecret is the shared AUTH_SECRET used by both Next.js and Go.
func RequireAuth(authSecret string) func(http.Handler) http.Handler {
	// Pre-encode the secret as bytes for HMAC verification.
	secretBytes := []byte(authSecret)

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// ── Step 1: Extract the JWT token ───────────────────────────
			tokenString := extractToken(r)
			if tokenString == "" {
				response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED",
					"Missing authentication token", nil)
				return
			}

			// ── Step 2: Parse and verify the HS256 signature ────────────
			token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
				// SECURITY: Ensure the signing method is HS256, not RS256/none/etc.
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
				}
				return secretBytes, nil
			})

			if err != nil || !token.Valid {
				response.Error(w, http.StatusUnauthorized, "INVALID_TOKEN",
					"Invalid or expired authentication token", nil)
				return
			}

			// ── Step 3: Extract the userId from claims ──────────────────
			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				response.Error(w, http.StatusUnauthorized, "INVALID_CLAIMS",
					"Could not parse token claims", nil)
				return
			}

			// Auth.js puts the database user ID in the "sub" claim.
			// It may be a string (from Auth.js) like "1", "42", etc.
			sub, err := claims.GetSubject()
			if err != nil || sub == "" {
				response.Error(w, http.StatusUnauthorized, "MISSING_SUBJECT",
					"Token missing user identifier (sub claim)", nil)
				return
			}

			// Convert the string subject to an integer user ID.
			userID, err := strconv.Atoi(sub)
			if err != nil {
				response.Error(w, http.StatusUnauthorized, "INVALID_SUBJECT",
					"Invalid user identifier in token", nil)
				return
			}

			// ── Step 4: Inject userId into context ──────────────────────
			ctx := ContextWithUserID(r.Context(), userID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// extractToken tries to get the JWT from the request in this order:
// 1. Authorization: Bearer <token> header
// 2. Auth.js session cookie (authjs.session-token)
func extractToken(r *http.Request) string {
	// Try Authorization header first (standard approach for API calls)
	authHeader := r.Header.Get("Authorization")
	if authHeader != "" {
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) == 2 && strings.EqualFold(parts[0], "Bearer") {
			return strings.TrimSpace(parts[1])
		}
	}

	// Fall back to Auth.js session cookie (for same-origin requests)
	cookie, err := r.Cookie("authjs.session-token")
	if err == nil && cookie.Value != "" {
		return cookie.Value
	}

	// Also check the production cookie name
	cookie, err = r.Cookie("__Secure-authjs.session-token")
	if err == nil && cookie.Value != "" {
		return cookie.Value
	}

	return ""
}
