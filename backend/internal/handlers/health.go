package handlers

import (
	"context"
	"net/http"

	"learntracker/internal/database"
	"learntracker/internal/response"
)

// HealthCheck verifies the database connection.
func HealthCheck(w http.ResponseWriter, r *http.Request) {
	pool := database.GetPool()
	err := pool.Ping(context.Background())
	if err != nil {
		response.Success(w, http.StatusOK, map[string]string{
			"status":   "unhealthy",
			"database": err.Error(),
		})
		return
	}
	response.Success(w, http.StatusOK, map[string]string{
		"status":   "healthy",
		"database": "connected",
	})
}

// Root returns a welcome message.
func Root(w http.ResponseWriter, r *http.Request) {
	response.Success(w, http.StatusOK, map[string]string{
		"message": "LearnTracker API is running",
	})
}
