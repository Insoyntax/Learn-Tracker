package main

import (
	"log"
	"net/http"

	"learntracker/internal/config"
	"learntracker/internal/database"
	"learntracker/internal/router"
)

func main() {
	// Load configuration (including AUTH_SECRET for JWT verification)
	cfg := config.Load()

	// Connect to database
	database.Connect(cfg.DatabaseURL)
	defer database.Close()

	// Setup router with auth middleware configured
	handler := router.New(cfg)

	// Start server
	addr := ":" + cfg.Port
	log.Printf("LearnTracker API server starting on %s", addr)
	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
