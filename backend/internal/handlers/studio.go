package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"

	"learntracker/internal/database"
	"learntracker/internal/middleware"
	"learntracker/internal/models"
	"learntracker/internal/response"
)

// GetStudioTasks lists studio tasks for the current user.
func GetStudioTasks(w http.ResponseWriter, r *http.Request) {
	userID := middleware.UserIDFromContext(r.Context())
	pool := database.GetPool()
	rows, err := pool.Query(context.Background(),
		`SELECT id, title, description, status, category_id, user_id, created_at
		 FROM studio_tasks WHERE user_id = $1 ORDER BY id LIMIT 100`, userID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
		return
	}
	defer rows.Close()

	tasks := []models.StudioTask{}
	for rows.Next() {
		var t models.StudioTask
		if err := rows.Scan(&t.ID, &t.Title, &t.Description, &t.Status,
			&t.CategoryID, &t.UserID, &t.CreatedAt); err != nil {
			response.Error(w, http.StatusInternalServerError, "SCAN_ERROR", err.Error(), nil)
			return
		}
		tasks = append(tasks, t)
	}
	response.Success(w, http.StatusOK, tasks)
}

// CreateStudioTask creates a new studio task.
func CreateStudioTask(w http.ResponseWriter, r *http.Request) {
	userID := middleware.UserIDFromContext(r.Context())

	var input models.StudioTaskCreate
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Invalid request body", nil)
		return
	}

	pool := database.GetPool()

	// Verify category belongs to user
	var catExists bool
	err := pool.QueryRow(context.Background(),
		`SELECT EXISTS(SELECT 1 FROM categories WHERE id = $1 AND user_id = $2)`,
		input.CategoryID, userID,
	).Scan(&catExists)
	if err != nil || !catExists {
		response.Error(w, http.StatusNotFound, "NOT_FOUND", "Category not found", nil)
		return
	}

	var t models.StudioTask
	err = pool.QueryRow(context.Background(),
		`INSERT INTO studio_tasks (title, description, status, category_id, user_id)
		 VALUES ($1, $2, $3, $4, $5)
		 RETURNING id, title, description, status, category_id, user_id, created_at`,
		input.Title, input.Description, input.Status, input.CategoryID, userID,
	).Scan(&t.ID, &t.Title, &t.Description, &t.Status, &t.CategoryID, &t.UserID, &t.CreatedAt)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
		return
	}
	response.Success(w, http.StatusOK, t)
}

// UpdateStudioTask updates a studio task's status.
func UpdateStudioTask(w http.ResponseWriter, r *http.Request) {
	userID := middleware.UserIDFromContext(r.Context())

	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid task ID", nil)
		return
	}

	var input models.StudioTaskUpdate
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Invalid request body", nil)
		return
	}

	pool := database.GetPool()
	var t models.StudioTask
	err = pool.QueryRow(context.Background(),
		`UPDATE studio_tasks SET status = $1 WHERE id = $2 AND user_id = $3
		 RETURNING id, title, description, status, category_id, user_id, created_at`,
		input.Status, id, userID,
	).Scan(&t.ID, &t.Title, &t.Description, &t.Status, &t.CategoryID, &t.UserID, &t.CreatedAt)
	if err != nil {
		response.Error(w, http.StatusNotFound, "NOT_FOUND", "Task not found", nil)
		return
	}
	response.Success(w, http.StatusOK, t)
}

// DeleteStudioTask deletes a studio task by ID.
func DeleteStudioTask(w http.ResponseWriter, r *http.Request) {
	userID := middleware.UserIDFromContext(r.Context())

	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid task ID", nil)
		return
	}

	pool := database.GetPool()
	var t models.StudioTask
	err = pool.QueryRow(context.Background(),
		`DELETE FROM studio_tasks WHERE id = $1 AND user_id = $2
		 RETURNING id, title, description, status, category_id, user_id, created_at`,
		id, userID,
	).Scan(&t.ID, &t.Title, &t.Description, &t.Status, &t.CategoryID, &t.UserID, &t.CreatedAt)
	if err != nil {
		response.Error(w, http.StatusNotFound, "NOT_FOUND", "Task not found", nil)
		return
	}
	response.Success(w, http.StatusOK, t)
}
