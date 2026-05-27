package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/jackc/pgx/v5"

	"learntracker/internal/database"
	"learntracker/internal/middleware"
	"learntracker/internal/models"
	"learntracker/internal/response"
)

// GetDashboardLayout gets or creates the user's dashboard layout.
func GetDashboardLayout(w http.ResponseWriter, r *http.Request) {
	userID := middleware.UserIDFromContext(r.Context())
	pool := database.GetPool()
	var layout models.DashboardLayout

	err := pool.QueryRow(context.Background(),
		`SELECT id, user_id, layout_data, updated_at FROM dashboard_layouts WHERE user_id = $1`,
		userID,
	).Scan(&layout.ID, &layout.UserID, &layout.LayoutData, &layout.UpdatedAt)

	if err == pgx.ErrNoRows {
		// Create default empty layout
		err = pool.QueryRow(context.Background(),
			`INSERT INTO dashboard_layouts (user_id, layout_data) VALUES ($1, $2)
			 RETURNING id, user_id, layout_data, updated_at`,
			userID, "[]",
		).Scan(&layout.ID, &layout.UserID, &layout.LayoutData, &layout.UpdatedAt)
		if err != nil {
			response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
			return
		}
	} else if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
		return
	}

	response.Success(w, http.StatusOK, layout)
}

// UpdateDashboardLayout updates or creates the user's dashboard layout.
func UpdateDashboardLayout(w http.ResponseWriter, r *http.Request) {
	userID := middleware.UserIDFromContext(r.Context())

	var input models.DashboardLayoutUpdate
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Invalid request body", nil)
		return
	}

	pool := database.GetPool()
	var layout models.DashboardLayout

	err := pool.QueryRow(context.Background(),
		`INSERT INTO dashboard_layouts (user_id, layout_data)
		 VALUES ($1, $2)
		 ON CONFLICT (user_id) DO UPDATE SET layout_data = EXCLUDED.layout_data, updated_at = NOW()
		 RETURNING id, user_id, layout_data, updated_at`,
		userID, input.LayoutData,
	).Scan(&layout.ID, &layout.UserID, &layout.LayoutData, &layout.UpdatedAt)

	if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
		return
	}

	response.Success(w, http.StatusOK, layout)
}
