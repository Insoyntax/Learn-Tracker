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

// GetFlashcards lists all flashcards.
func GetFlashcards(w http.ResponseWriter, r *http.Request) {
	pool := database.GetPool()
	rows, err := pool.Query(context.Background(),
		`SELECT id, front, back, category_id, user_id, next_review_date, interval, ease_factor
		 FROM flashcards ORDER BY id LIMIT 100`)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
		return
	}
	defer rows.Close()

	flashcards := []models.Flashcard{}
	for rows.Next() {
		var f models.Flashcard
		if err := rows.Scan(&f.ID, &f.Front, &f.Back, &f.CategoryID, &f.UserID,
			&f.NextReviewDate, &f.Interval, &f.EaseFactor); err != nil {
			response.Error(w, http.StatusInternalServerError, "SCAN_ERROR", err.Error(), nil)
			return
		}
		flashcards = append(flashcards, f)
	}
	response.Success(w, http.StatusOK, flashcards)
}

// CreateFlashcard creates a new flashcard.
func CreateFlashcard(w http.ResponseWriter, r *http.Request) {
	var input models.FlashcardCreate
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Invalid request body", nil)
		return
	}

	pool := database.GetPool()
	var f models.Flashcard
	err := pool.QueryRow(context.Background(),
		`INSERT INTO flashcards (front, back, category_id, user_id, interval, ease_factor)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 RETURNING id, front, back, category_id, user_id, next_review_date, interval, ease_factor`,
		input.Front, input.Back, input.CategoryID, 1, input.Interval, input.EaseFactor,
	).Scan(&f.ID, &f.Front, &f.Back, &f.CategoryID, &f.UserID, &f.NextReviewDate, &f.Interval, &f.EaseFactor)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
		return
	}
	response.Success(w, http.StatusOK, f)
}

// ReviewFlashcard updates the review data for a flashcard.
func ReviewFlashcard(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid flashcard ID", nil)
		return
	}

	var input models.FlashcardReviewUpdate
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Invalid request body", nil)
		return
	}

	pool := database.GetPool()
	var f models.Flashcard
	err = pool.QueryRow(context.Background(),
		`UPDATE flashcards SET next_review_date = $1, interval = $2, ease_factor = $3
		 WHERE id = $4
		 RETURNING id, front, back, category_id, user_id, next_review_date, interval, ease_factor`,
		input.NextReviewDate, input.Interval, input.EaseFactor, id,
	).Scan(&f.ID, &f.Front, &f.Back, &f.CategoryID, &f.UserID, &f.NextReviewDate, &f.Interval, &f.EaseFactor)
	if err != nil {
		response.Error(w, http.StatusNotFound, "NOT_FOUND", "Flashcard not found", nil)
		return
	}
	response.Success(w, http.StatusOK, f)
}

// DeleteFlashcard deletes a flashcard by ID.
func DeleteFlashcard(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid flashcard ID", nil)
		return
	}

	pool := database.GetPool()
	tag, err := pool.Exec(context.Background(), `DELETE FROM flashcards WHERE id = $1`, id)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
		return
	}
	if tag.RowsAffected() == 0 {
		response.Error(w, http.StatusNotFound, "NOT_FOUND", "Flashcard not found", nil)
		return
	}
	response.Success(w, http.StatusOK, map[string]string{"message": "Flashcard deleted successfully"})
}
