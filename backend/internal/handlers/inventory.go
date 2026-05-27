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

// GetInventoryItems lists all inventory items.
func GetInventoryItems(w http.ResponseWriter, r *http.Request) {
	pool := database.GetPool()
	rows, err := pool.Query(context.Background(),
		`SELECT id, title, type, content, category_id, user_id
		 FROM inventory_items ORDER BY id LIMIT 100`)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
		return
	}
	defer rows.Close()

	items := []models.InventoryItem{}
	for rows.Next() {
		var item models.InventoryItem
		if err := rows.Scan(&item.ID, &item.Title, &item.Type, &item.Content,
			&item.CategoryID, &item.UserID); err != nil {
			response.Error(w, http.StatusInternalServerError, "SCAN_ERROR", err.Error(), nil)
			return
		}
		items = append(items, item)
	}
	response.Success(w, http.StatusOK, items)
}

// CreateInventoryItem creates a new inventory item.
func CreateInventoryItem(w http.ResponseWriter, r *http.Request) {
	var input models.InventoryItemCreate
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Invalid request body", nil)
		return
	}

	pool := database.GetPool()
	var item models.InventoryItem
	err := pool.QueryRow(context.Background(),
		`INSERT INTO inventory_items (title, type, content, category_id, user_id)
		 VALUES ($1, $2, $3, $4, $5)
		 RETURNING id, title, type, content, category_id, user_id`,
		input.Title, input.Type, input.Content, input.CategoryID, 1,
	).Scan(&item.ID, &item.Title, &item.Type, &item.Content, &item.CategoryID, &item.UserID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
		return
	}
	response.Success(w, http.StatusOK, item)
}

// DeleteInventoryItem deletes an inventory item by ID.
func DeleteInventoryItem(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_ID", "Invalid item ID", nil)
		return
	}

	pool := database.GetPool()
	tag, err := pool.Exec(context.Background(), `DELETE FROM inventory_items WHERE id = $1`, id)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "DB_ERROR", err.Error(), nil)
		return
	}
	if tag.RowsAffected() == 0 {
		response.Error(w, http.StatusNotFound, "NOT_FOUND", "Inventory item not found", nil)
		return
	}
	response.Success(w, http.StatusOK, map[string]string{"message": "Inventory item deleted successfully"})
}
