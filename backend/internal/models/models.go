package models

import "time"

// User represents the users table logic mapped from Auth.js schemas.
type User struct {
	ID            int        `json:"id"`
	Name          *string    `json:"name"`
	Email         string     `json:"email"`
	EmailVerified *time.Time `json:"emailVerified"`
	Image         *string    `json:"image"`

	XP            int     `json:"xp"`
	Level         int     `json:"level"`
	CurrentStreak int     `json:"current_streak"`
	ThemeColor    *string `json:"theme_color"`
}

// Category represents the categories table.
type Category struct {
	ID     int    `json:"id"`
	Name   string `json:"name"`
	UserID int    `json:"user_id"`
}

// Roadmap represents the roadmaps table.
type Roadmap struct {
	ID        int           `json:"id"`
	Title     string        `json:"title"`
	UserID    int           `json:"user_id"`
	Progress  int           `json:"progress"`
	CreatedAt time.Time     `json:"created_at"`
	Steps     []RoadmapStep `json:"steps"`
}

// RoadmapStep represents the roadmap_steps table.
type RoadmapStep struct {
	ID          int    `json:"id"`
	RoadmapID   int    `json:"roadmap_id"`
	Title       string `json:"title"`
	Order       int    `json:"order"`
	IsCompleted bool   `json:"is_completed"`
}

// Resource represents the resources table.
type Resource struct {
	ID         int       `json:"id"`
	Title      string    `json:"title"`
	URL        string    `json:"url"`
	Type       string    `json:"type"`
	CategoryID int       `json:"category_id"`
	UserID     int       `json:"user_id"`
	IsConsumed bool      `json:"is_consumed"`
	Category   *Category `json:"category,omitempty"`
}

// StudyLog represents the study_logs table.
type StudyLog struct {
	ID              int        `json:"id"`
	Date            string     `json:"date"`
	DurationMinutes int        `json:"duration_minutes"`
	Notes           *string    `json:"notes"`
	CategoryID      int        `json:"category_id"`
	UserID          int        `json:"user_id"`
	StartTime       time.Time  `json:"start_time"`
	EndTime         *time.Time `json:"end_time"`
	Status          string     `json:"status"` // "running", "paused", "completed"
	Category        *Category  `json:"category,omitempty"`
}

// Note represents the notes table.
type Note struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	Tags      []string  `json:"tags"`
	UserID    int       `json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// LevelConfig represents the level_configs table.
type LevelConfig struct {
	Level      int    `json:"level"`
	MinXP      int    `json:"min_xp"`
	MaxXP      int    `json:"max_xp"`
	TitleBadge string `json:"title_badge"`
}

// Project represents the projects table.
type Project struct {
	ID          int        `json:"id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	ImageURL    *string    `json:"image_url"`
	DemoURL     *string    `json:"demo_url"`
	CategoryID  int        `json:"category_id"`
	UserID      int        `json:"user_id"`
	CreatedAt   *time.Time `json:"created_at"`
}

// Flashcard represents the flashcards table.
type Flashcard struct {
	ID             int        `json:"id"`
	Front          string     `json:"front"`
	Back           string     `json:"back"`
	CategoryID     int        `json:"category_id"`
	UserID         int        `json:"user_id"`
	NextReviewDate *time.Time `json:"next_review_date"`
	Interval       int        `json:"interval"`
	EaseFactor     float64    `json:"ease_factor"`
}

// InventoryItem represents the inventory_items table.
type InventoryItem struct {
	ID         int    `json:"id"`
	Title      string `json:"title"`
	Type       string `json:"type"`
	Content    string `json:"content"`
	CategoryID int    `json:"category_id"`
	UserID     int    `json:"user_id"`
}

// Quest represents the quests table.
type Quest struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Rank        string `json:"rank"`
	XPReward    int    `json:"xp_reward"`
	IsCompleted bool   `json:"is_completed"`
	UserID      int    `json:"user_id"`
}

// StudioTask represents the studio_tasks table.
type StudioTask struct {
	ID          int        `json:"id"`
	Title       string     `json:"title"`
	Description *string    `json:"description"`
	Status      string     `json:"status"`
	CategoryID  int        `json:"category_id"`
	UserID      int        `json:"user_id"`
	CreatedAt   *time.Time `json:"created_at"`
}

// DashboardLayout represents the dashboard_layouts table.
type DashboardLayout struct {
	ID         int       `json:"id"`
	UserID     int       `json:"user_id"`
	LayoutData string    `json:"layout_data"`
	UpdatedAt  time.Time `json:"updated_at"`
}

// FamiliarState represents the familiar_states table.
type FamiliarState struct {
	ID        int       `json:"id"`
	UserID    int       `json:"user_id"`
	Level     int       `json:"level"`
	CurrentHP int       `json:"current_hp"`
	MaxHP     int       `json:"max_hp"`
	LastFedAt time.Time `json:"last_fed_at"`
}

// ── Request/Input DTOs ──────────────────────────────────────────────────────

// NoteCreate is the input for creating a note.
type NoteCreate struct {
	Title   string   `json:"title"`
	Content string   `json:"content"`
	Tags    []string `json:"tags"`
}

// NoteUpdate is the input for updating a note.
type NoteUpdate struct {
	Title   string   `json:"title"`
	Content string   `json:"content"`
	Tags    []string `json:"tags"`
}

// StudyLogCreate is the input for starting a study session.
type StudyLogCreate struct {
	CategoryID int    `json:"category_id"`
	Notes      string `json:"notes"`
}

// StudyLogComplete is the input for completing a study session.
type StudyLogComplete struct {
	Notes *string `json:"notes"`
}

// ProjectCreate is the input for creating a project.
type ProjectCreate struct {
	Title       string  `json:"title"`
	Description string  `json:"description"`
	ImageURL    *string `json:"image_url"`
	DemoURL     *string `json:"demo_url"`
	CategoryID  int     `json:"category_id"`
}

// FlashcardCreate is the input for creating a flashcard.
type FlashcardCreate struct {
	Front      string  `json:"front"`
	Back       string  `json:"back"`
	Interval   int     `json:"interval"`
	EaseFactor float64 `json:"ease_factor"`
	CategoryID int     `json:"category_id"`
}

// FlashcardReviewUpdate is the input for reviewing a flashcard.
type FlashcardReviewUpdate struct {
	NextReviewDate time.Time `json:"next_review_date"`
	Interval       int       `json:"interval"`
	EaseFactor     float64   `json:"ease_factor"`
}

// InventoryItemCreate is the input for creating an inventory item.
type InventoryItemCreate struct {
	Title      string `json:"title"`
	Type       string `json:"type"`
	Content    string `json:"content"`
	CategoryID int    `json:"category_id"`
}

// QuestCreate is the input for creating a quest.
type QuestCreate struct {
	Title       string `json:"title"`
	Rank        string `json:"rank"`
	XPReward    int    `json:"xp_reward"`
	IsCompleted bool   `json:"is_completed"`
}

// QuestCompleteUpdate is the input for completing a quest.
type QuestCompleteUpdate struct {
	IsCompleted bool `json:"is_completed"`
}

// StudioTaskCreate is the input for creating a studio task.
type StudioTaskCreate struct {
	Title       string  `json:"title"`
	Description *string `json:"description"`
	Status      string  `json:"status"`
	CategoryID  int     `json:"category_id"`
}

// StudioTaskUpdate is the input for updating a studio task status.
type StudioTaskUpdate struct {
	Status string `json:"status"`
}

// DashboardLayoutUpdate is the input for updating dashboard layout.
type DashboardLayoutUpdate struct {
	LayoutData string `json:"layout_data"`
}

// FamiliarStateUpdate is the input for feeding the familiar.
type FamiliarStateUpdate struct {
	CurrentHP int       `json:"current_hp"`
	LastFedAt time.Time `json:"last_fed_at"`
}
