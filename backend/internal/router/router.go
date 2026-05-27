package router

import (
	"net/http"

	"learntracker/internal/config"
	"learntracker/internal/handlers"
	"learntracker/internal/middleware"
)

// corsMiddleware adds CORS headers to allow the frontend (localhost:3000) to connect.
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// Handle preflight
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// New creates and returns the configured HTTP handler with all routes.
// cfg is passed to create the JWT auth middleware with the shared AUTH_SECRET.
func New(cfg *config.Config) http.Handler {
	mux := http.NewServeMux()

	// ── Public routes (no auth required) ────────────────────────────────────
	mux.HandleFunc("GET /{$}", handlers.Root)
	mux.HandleFunc("GET /health", handlers.HealthCheck)
	mux.HandleFunc("POST /api/v1/auth/signup", handlers.Register)
	mux.HandleFunc("POST /api/v1/auth/login", handlers.Login)

	// ── Protected API routes ────────────────────────────────────────────────
	// All /api/v1/* routes require a valid JWT token.
	apiMux := http.NewServeMux()

	// ── Stub endpoints ──────────────────────────────────────────────────────
	apiMux.HandleFunc("GET /api/v1/users/", handlers.GetUsers)
	apiMux.HandleFunc("GET /api/v1/roadmaps/", handlers.GetRoadmaps)
	apiMux.HandleFunc("GET /api/v1/resources/", handlers.GetResources)

	// ── Notes (CRUD with pagination, filtering, XSS sanitization) ───────
	apiMux.HandleFunc("GET /api/v1/notes/", handlers.GetNotes)
	apiMux.HandleFunc("POST /api/v1/notes/", handlers.CreateNote)
	apiMux.HandleFunc("PUT /api/v1/notes/{id}", handlers.UpdateNote)
	apiMux.HandleFunc("DELETE /api/v1/notes/{id}", handlers.DeleteNote)

	// ── Projects ────────────────────────────────────────────────────────────
	apiMux.HandleFunc("GET /api/v1/projects/", handlers.GetProjects)
	apiMux.HandleFunc("POST /api/v1/projects/", handlers.CreateProject)
	apiMux.HandleFunc("DELETE /api/v1/projects/{id}", handlers.DeleteProject)

	// ── Flashcards ──────────────────────────────────────────────────────────
	apiMux.HandleFunc("GET /api/v1/flashcards/", handlers.GetFlashcards)
	apiMux.HandleFunc("POST /api/v1/flashcards/", handlers.CreateFlashcard)
	apiMux.HandleFunc("PUT /api/v1/flashcards/{id}/review", handlers.ReviewFlashcard)
	apiMux.HandleFunc("DELETE /api/v1/flashcards/{id}", handlers.DeleteFlashcard)

	// ── Inventory ───────────────────────────────────────────────────────────
	apiMux.HandleFunc("GET /api/v1/inventory/", handlers.GetInventoryItems)
	apiMux.HandleFunc("POST /api/v1/inventory/", handlers.CreateInventoryItem)
	apiMux.HandleFunc("DELETE /api/v1/inventory/{id}", handlers.DeleteInventoryItem)

	// ── Quests ──────────────────────────────────────────────────────────────
	apiMux.HandleFunc("GET /api/v1/quests/", handlers.GetActiveQuests)
	apiMux.HandleFunc("GET /api/v1/quests/all", handlers.GetAllQuests)
	apiMux.HandleFunc("POST /api/v1/quests/", handlers.CreateQuest)
	apiMux.HandleFunc("PUT /api/v1/quests/{id}/complete", handlers.CompleteQuest)
	apiMux.HandleFunc("DELETE /api/v1/quests/{id}", handlers.DeleteQuest)

	// ── Studio Tasks ────────────────────────────────────────────────────────
	apiMux.HandleFunc("GET /api/v1/studio/", handlers.GetStudioTasks)
	apiMux.HandleFunc("POST /api/v1/studio/", handlers.CreateStudioTask)
	apiMux.HandleFunc("PUT /api/v1/studio/{id}", handlers.UpdateStudioTask)
	apiMux.HandleFunc("DELETE /api/v1/studio/{id}", handlers.DeleteStudioTask)

	// ── Dashboard Layout ────────────────────────────────────────────────────
	apiMux.HandleFunc("GET /api/v1/dashboard/layout/", handlers.GetDashboardLayout)
	apiMux.HandleFunc("PUT /api/v1/dashboard/layout/", handlers.UpdateDashboardLayout)

	// ── Familiar ────────────────────────────────────────────────────────────
	apiMux.HandleFunc("GET /api/v1/familiar/", handlers.GetFamiliarState)
	apiMux.HandleFunc("PUT /api/v1/familiar/feed", handlers.FeedFamiliar)

	// Wrap API routes with JWT auth middleware.
	// Token is verified using AUTH_SECRET (same secret as the Next.js frontend).
	authMiddleware := middleware.RequireAuth(cfg.AuthSecret)
	mux.Handle("/api/", authMiddleware(apiMux))

	return corsMiddleware(mux)
}
