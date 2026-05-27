package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"

	"learntracker/internal/database"
	"learntracker/internal/models"
	"learntracker/internal/response"
)

// GetProjects lists all projects.
func GetProjects(w http.ResponseWriter, r *http.Request) {
	pool := database.GetPool()
	rows, err := pool.Query(context.Background(),
		`SELECT id, title, description, image_url, demo_url, category_id, user_id, created_at
		 FROM projects ORDER BY id LIMIT 100`)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
		return
	}
	defer rows.Close()

	projects := []models.Project{}
	for rows.Next() {
		var p models.Project
		if err := rows.Scan(&p.ID, &p.Title, &p.Description, &p.ImageURL, &p.DemoURL,
			&p.CategoryID, &p.UserID, &p.CreatedAt); err != nil {
			response.Error(w, http.StatusInternalServerError, "SCAN_ERROR", err.Error(), nil)
			return
		}
		projects = append(projects, p)
	}
	response.Success(w, http.StatusOK, projects)
}

// CreateProject creates a new project.
func CreateProject(w http.ResponseWriter, r *http.Request) {
	var input models.ProjectCreate
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Invalid request body", nil)
		return
	}

	pool := database.GetPool()
	var p models.Project
	err := pool.QueryRow(context.Background(),
		`INSERT INTO projects (title, description, image_url, demo_url, category_id, user_id)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 RETURNING id, title, description, image_url, demo_url, category_id, user_id, created_at`,
		input.Title, input.Description, input.ImageURL, input.DemoURL, input.CategoryID, 1,
	).Scan(&p.ID, &p.Title, &p.Description, &p.ImageURL, &p.DemoURL, &p.CategoryID, &p.UserID, &p.CreatedAt)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
		return
	}
	response.Success(w, http.StatusOK, p)
}

// DeleteProject deletes a project by ID.
func DeleteProject(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid project ID", nil)
		return
	}

	pool := database.GetPool()
	tag, err := pool.Exec(context.Background(), `DELETE FROM projects WHERE id = $1`, id)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
		return
	}
	if tag.RowsAffected() == 0 {
		response.Error(w, http.StatusNotFound, "NOT_FOUND", "Project not found", nil)
		return
	}
	response.Success(w, http.StatusOK, map[string]string{"message": "Project deleted successfully"})
}
