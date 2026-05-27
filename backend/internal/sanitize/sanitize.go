package sanitize

import "github.com/microcosm-cc/bluemonday"

// policy is the shared UGC (user-generated content) policy.
// It allows safe HTML tags commonly used in markdown rendering
// (p, b, i, a, ul, ol, li, code, pre, blockquote, h1-h6, etc.)
// while stripping dangerous elements like <script>, event handlers, etc.
var policy = bluemonday.UGCPolicy()

// HTML sanitizes user-submitted HTML/markdown content.
// It strips dangerous tags and attributes while preserving
// safe formatting typically produced by markdown renderers.
func HTML(input string) string {
	return policy.Sanitize(input)
}
