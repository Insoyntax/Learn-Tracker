package handlers

import (
	"net/http"

	"learntracker/internal/response"
)

// ── Stub Handlers (hardcoded responses matching original FastAPI) ────────────

// GetUsers returns a hardcoded list of users.
func GetUsers(w http.ResponseWriter, r *http.Request) {
	response.Success(w, http.StatusOK, []map[string]string{
		{"username": "Rick"},
		{"username": "Morty"},
	})
}

// GetRoadmaps returns a hardcoded list of roadmaps.
func GetRoadmaps(w http.ResponseWriter, r *http.Request) {
	response.Success(w, http.StatusOK, []map[string]string{
		{"title": "Python Mastery"},
	})
}

// GetResources returns a hardcoded list of resources.
func GetResources(w http.ResponseWriter, r *http.Request) {
	response.Success(w, http.StatusOK, []map[string]string{
		{"title": "FastAPI Docs", "url": "https://fastapi.tiangolo.com"},
	})
}
