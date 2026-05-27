package middleware

// ─── Context Keys ───────────────────────────────────────────────────────────
// Custom context key type prevents collisions with other packages.
// The Go backend injects the authenticated userId into the request context
// so that downstream handlers can identify which user made the request.

import "context"

// contextKey is an unexported type to prevent collisions in context values.
type contextKey string

// userIDKey is the context key for the authenticated user's ID.
const userIDKey contextKey = "userId"

// ContextWithUserID returns a new context with the given userId embedded.
func ContextWithUserID(ctx context.Context, userID int) context.Context {
	return context.WithValue(ctx, userIDKey, userID)
}

// UserIDFromContext extracts the authenticated userId from the request context.
// Returns 0 if no userId is found (should never happen behind auth middleware).
func UserIDFromContext(ctx context.Context) int {
	userID, ok := ctx.Value(userIDKey).(int)
	if !ok {
		return 0
	}
	return userID
}
