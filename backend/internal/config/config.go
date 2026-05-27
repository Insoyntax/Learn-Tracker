package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// Config holds all configuration for the application.
type Config struct {
	DatabaseURL string
	Port        string
	AuthSecret  string // Shared HS256 JWT secret (must match Next.js AUTH_SECRET)
}

// Load reads the .env file and returns a Config struct.
func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using environment variables")
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL environment variable is required")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	// AUTH_SECRET must be identical to the one in the Next.js frontend.
	// It is used by the JWT middleware to verify HS256 token signatures.
	authSecret := os.Getenv("AUTH_SECRET")
	if authSecret == "" {
		log.Fatal("AUTH_SECRET environment variable is required (must match Next.js AUTH_SECRET)")
	}

	return &Config{
		DatabaseURL: dbURL,
		Port:        port,
		AuthSecret:  authSecret,
	}
}
