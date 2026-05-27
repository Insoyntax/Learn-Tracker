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

// GetActiveQuests lists active (incomplete) quests.
func GetActiveQuests(w http.ResponseWriter, r *http.Request) {
	pool := database.GetPool()
	rows, err := pool.Query(context.Background(),
		`SELECT id, title, rank, xp_reward, is_completed, user_id
		 FROM quests WHERE is_completed = false ORDER BY id LIMIT 100`)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
		return
	}
	defer rows.Close()

	quests := []models.Quest{}
	for rows.Next() {
		var q models.Quest
		if err := rows.Scan(&q.ID, &q.Title, &q.Rank, &q.XPReward, &q.IsCompleted, &q.UserID); err != nil {
			response.Error(w, http.StatusInternalServerError, "SCAN_ERROR", err.Error(), nil)
			return
		}
		quests = append(quests, q)
	}
	response.Success(w, http.StatusOK, quests)
}

// GetAllQuests lists all quests (active + completed).
func GetAllQuests(w http.ResponseWriter, r *http.Request) {
	pool := database.GetPool()
	rows, err := pool.Query(context.Background(),
		`SELECT id, title, rank, xp_reward, is_completed, user_id
		 FROM quests ORDER BY id LIMIT 100`)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
		return
	}
	defer rows.Close()

	quests := []models.Quest{}
	for rows.Next() {
		var q models.Quest
		if err := rows.Scan(&q.ID, &q.Title, &q.Rank, &q.XPReward, &q.IsCompleted, &q.UserID); err != nil {
			response.Error(w, http.StatusInternalServerError, "SCAN_ERROR", err.Error(), nil)
			return
		}
		quests = append(quests, q)
	}
	response.Success(w, http.StatusOK, quests)
}

// CreateQuest creates a new quest.
func CreateQuest(w http.ResponseWriter, r *http.Request) {
	var input models.QuestCreate
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Invalid request body", nil)
		return
	}

	pool := database.GetPool()
	var q models.Quest
	err := pool.QueryRow(context.Background(),
		`INSERT INTO quests (title, rank, xp_reward, is_completed, user_id)
		 VALUES ($1, $2, $3, $4, $5)
		 RETURNING id, title, rank, xp_reward, is_completed, user_id`,
		input.Title, input.Rank, input.XPReward, input.IsCompleted, 1,
	).Scan(&q.ID, &q.Title, &q.Rank, &q.XPReward, &q.IsCompleted, &q.UserID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
		return
	}
	response.Success(w, http.StatusOK, q)
}

// CompleteQuest marks a quest as completed.
func CompleteQuest(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid quest ID", nil)
		return
	}

	var input models.QuestCompleteUpdate
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Invalid request body", nil)
		return
	}

	pool := database.GetPool()
	var q models.Quest
	err = pool.QueryRow(context.Background(),
		`UPDATE quests SET is_completed = $1 WHERE id = $2
		 RETURNING id, title, rank, xp_reward, is_completed, user_id`,
		input.IsCompleted, id,
	).Scan(&q.ID, &q.Title, &q.Rank, &q.XPReward, &q.IsCompleted, &q.UserID)
	if err != nil {
		response.Error(w, http.StatusNotFound, "NOT_FOUND", "Quest not found", nil)
		return
	}
	response.Success(w, http.StatusOK, q)
}

// DeleteQuest deletes a quest by ID.
func DeleteQuest(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid quest ID", nil)
		return
	}

	pool := database.GetPool()
	tag, err := pool.Exec(context.Background(), `DELETE FROM quests WHERE id = $1`, id)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
		return
	}
	if tag.RowsAffected() == 0 {
		response.Error(w, http.StatusNotFound, "NOT_FOUND", "Quest not found", nil)
		return
	}
	response.Success(w, http.StatusOK, map[string]string{"message": "Quest deleted successfully"})
}
