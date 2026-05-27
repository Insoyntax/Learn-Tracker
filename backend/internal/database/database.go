package database

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

var pool *pgxpool.Pool

// Connect creates a connection pool to PostgreSQL.
func Connect(databaseURL string) {
	var err error
	pool, err = pgxpool.New(context.Background(), databaseURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}

	// Verify connection
	if err := pool.Ping(context.Background()); err != nil {
		log.Fatalf("Unable to ping database: %v", err)
	}

	log.Println("Database connected successfully")
}

// GetPool returns the database connection pool.
func GetPool() *pgxpool.Pool {
	return pool
}

// Close gracefully shuts down the pool.
func Close() {
	if pool != nil {
		pool.Close()
	}
}
