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

// GetFamiliarState gets or creates the user's familiar (tamagotchi) state.
func GetFamiliarState(w http.ResponseWriter, r *http.Request) {
	userID := middleware.UserIDFromContext(r.Context())
	pool := database.GetPool()
	var state models.FamiliarState

	err := pool.QueryRow(context.Background(),
		`SELECT id, user_id, level, current_hp, max_hp, last_fed_at
		 FROM familiar_states WHERE user_id = $1`,
		userID,
	).Scan(&state.ID, &state.UserID, &state.Level, &state.CurrentHP, &state.MaxHP, &state.LastFedAt)

	if err == pgx.ErrNoRows {
		err = pool.QueryRow(context.Background(),
			`INSERT INTO familiar_states (user_id) VALUES ($1)
			 RETURNING id, user_id, level, current_hp, max_hp, last_fed_at`,
			userID,
		).Scan(&state.ID, &state.UserID, &state.Level, &state.CurrentHP, &state.MaxHP, &state.LastFedAt)
		if err != nil {
			response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
			return
		}
	} else if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
		return
	}

	response.Success(w, http.StatusOK, state)
}

// FeedFamiliar updates the familiar's HP and last fed timestamp.
func FeedFamiliar(w http.ResponseWriter, r *http.Request) {
	userID := middleware.UserIDFromContext(r.Context())

	var input models.FamiliarStateUpdate
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Invalid request body", nil)
		return
	}

	pool := database.GetPool()

	var state models.FamiliarState
	err := pool.QueryRow(context.Background(),
		`SELECT id, user_id, level, current_hp, max_hp, last_fed_at
		 FROM familiar_states WHERE user_id = $1`,
		userID,
	).Scan(&state.ID, &state.UserID, &state.Level, &state.CurrentHP, &state.MaxHP, &state.LastFedAt)

	if err == pgx.ErrNoRows {
		err = pool.QueryRow(context.Background(),
			`INSERT INTO familiar_states (user_id) VALUES ($1)
			 RETURNING id, user_id, level, current_hp, max_hp, last_fed_at`,
			userID,
		).Scan(&state.ID, &state.UserID, &state.Level, &state.CurrentHP, &state.MaxHP, &state.LastFedAt)
		if err != nil {
			response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
			return
		}
	} else if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
		return
	}

	// Cap HP at max
	newHP := input.CurrentHP
	if newHP > state.MaxHP {
		newHP = state.MaxHP
	}

	err = pool.QueryRow(context.Background(),
		`UPDATE familiar_states SET current_hp = $1, last_fed_at = $2 WHERE user_id = $3
		 RETURNING id, user_id, level, current_hp, max_hp, last_fed_at`,
		newHP, input.LastFedAt, userID,
	).Scan(&state.ID, &state.UserID, &state.Level, &state.CurrentHP, &state.MaxHP, &state.LastFedAt)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
		return
	}

	response.Success(w, http.StatusOK, state)
}
