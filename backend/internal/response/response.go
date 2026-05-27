package response

import (
	"encoding/json"
	"net/http"
)

// ── Standardized API Response Structures ─────────────────────────────────────

// Pagination holds pagination metadata for list responses.
type Pagination struct {
	CurrentPage int `json:"currentPage"`
	TotalPages  int `json:"totalPages"`
	TotalItems  int `json:"totalItems"`
}

// ErrorDetail holds a structured error payload.
type ErrorDetail struct {
	Code    string   `json:"code"`
	Message string   `json:"message"`
	Details []string `json:"details"`
}

// successBody is the envelope for success responses.
type successBody struct {
	Success    bool        `json:"success"`
	Data       interface{} `json:"data"`
	Pagination *Pagination `json:"pagination,omitempty"`
}

// errorBody is the envelope for error responses.
type errorBody struct {
	Success bool        `json:"success"`
	Error   ErrorDetail `json:"error"`
}

// ── Public Helpers ───────────────────────────────────────────────────────────

// Success writes a standardized success response.
//
//	{"success": true, "data": ...}
func Success(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(successBody{
		Success: true,
		Data:    data,
	})
}

// SuccessPaginated writes a success response with pagination metadata.
//
//	{"success": true, "data": ..., "pagination": {"currentPage": ..., "totalPages": ..., "totalItems": ...}}
func SuccessPaginated(w http.ResponseWriter, status int, data interface{}, page, totalPages, totalItems int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(successBody{
		Success: true,
		Data:    data,
		Pagination: &Pagination{
			CurrentPage: page,
			TotalPages:  totalPages,
			TotalItems:  totalItems,
		},
	})
}

// Error writes a standardized error response.
//
//	{"success": false, "error": {"code": "...", "message": "...", "details": [...]}}
func Error(w http.ResponseWriter, status int, code string, message string, details []string) {
	if details == nil {
		details = []string{}
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(errorBody{
		Success: false,
		Error: ErrorDetail{
			Code:    code,
			Message: message,
			Details: details,
		},
	})
}
