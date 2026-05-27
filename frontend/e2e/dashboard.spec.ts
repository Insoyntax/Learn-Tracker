import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load with correct title', async ({ page }) => {
        await expect(page).toHaveTitle('Learn Tracker');
    });

    test('should display dashboard heading and welcome message', async ({ page }) => {
        const heading = page.locator('h1');
        await expect(heading).toHaveText('Dashboard');

        const welcome = page.locator('text=Welcome back, Student');
        await expect(welcome).toBeVisible();

        const streak = page.locator('text=12-day streak');
        await expect(streak).toBeVisible();
    });
});

test.describe('Sidebar Navigation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display the logo and brand name', async ({ page }) => {
        const logoText = page.locator('text=Learn Tracker');
        await expect(logoText).toBeVisible();

        // Logo icon "L"
        const logoIcon = page.locator('aside >> text=L').first();
        await expect(logoIcon).toBeVisible();
    });

    test('should render all navigation items', async ({ page }) => {
        const navItems = ['Dashboard', 'Roadmaps', 'Resources', 'Study Logs'];

        for (const item of navItems) {
            const navLink = page.locator(`aside >> text=${item}`);
            await expect(navLink).toBeVisible();
        }
    });

    test('should highlight Dashboard as active nav item', async ({ page }) => {
        const dashboardLink = page.locator('a[href="/"]');
        await expect(dashboardLink).toHaveClass(/bg-white\/10/);
    });

    test('should display settings link and user profile', async ({ page }) => {
        const settings = page.locator('aside >> text=Settings');
        await expect(settings).toBeVisible();

        const userName = page.locator('aside >> text=Student');
        await expect(userName).toBeVisible();

        const plan = page.locator('aside >> text=Pro Plan');
        await expect(plan).toBeVisible();
    });

    test('should navigate to other pages via sidebar links', async ({ page }) => {
        // Verify sidebar nav links have correct hrefs
        await expect(page.locator('a[href="/roadmaps"]')).toBeVisible();
        await expect(page.locator('a[href="/resources"]')).toBeVisible();
        await expect(page.locator('a[href="/logs"]')).toBeVisible();

        // Click Roadmaps link and verify URL changes
        await page.locator('a[href="/roadmaps"]').click();
        await expect(page).toHaveURL(/\/roadmaps/);
    });
});

test.describe('BentoGrid Layout', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should render the bento grid container', async ({ page }) => {
        // The grid should contain 5 motion.div children (4 widgets + Add Widget)
        const gridItems = page.locator('main >> .grid > div');
        await expect(gridItems).toHaveCount(5);
    });

    test('should display the Add Widget button', async ({ page }) => {
        const addWidget = page.locator('text=Add Widget');
        await expect(addWidget).toBeVisible();

        // Plus icon — use exact match to avoid matching "+50 XP" hover labels
        const plusIcon = page.getByText('+', { exact: true });
        await expect(plusIcon).toBeVisible();
    });
});

test.describe('Streak Widget', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display streak count of 12 days', async ({ page }) => {
        const streakCount = page.locator('h3:has-text("12")');
        await expect(streakCount).toBeVisible();

        const daysLabel = page.locator('text=days');
        await expect(daysLabel).toBeVisible();

        // Updated: widget now uses "🔥 Daily Streak" instead of "Current Streak"
        const streakLabel = page.locator('text=Daily Streak');
        await expect(streakLabel).toBeVisible();
    });

    test('should display Level 5 badge', async ({ page }) => {
        // Scope to the streak widget's Level badge (the first match in main)
        const levelBadge = page.locator('main').getByText('Level 5').first();
        await expect(levelBadge).toBeVisible();
    });

    test('should display XP progress bar', async ({ page }) => {
        const xpLabel = page.locator('text=XP Progress');
        await expect(xpLabel).toBeVisible();

        const xpValues = page.locator('text=2,400 / 3,000');
        await expect(xpValues).toBeVisible();
    });
});

test.describe('Roadmap Widget', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display roadmap title and path', async ({ page }) => {
        const title = page.locator('text=Mastering Python');
        await expect(title).toBeVisible();

        // Updated: category text now uses "Backend Path" (title-case, via store)
        const path = page.locator('text=Backend Path');
        await expect(path).toBeVisible();
    });

    test('should display all 4 roadmap steps', async ({ page }) => {
        const steps = [
            'Intro to Python',
            'Data Structures',
            'OOP Concepts',
            'Decorators & Generators',
        ];

        for (const step of steps) {
            const stepEl = page.locator(`text=${step}`);
            await expect(stepEl).toBeVisible();
        }
    });

    test('should show completed state for first 2 steps', async ({ page }) => {
        // Completed steps have line-through styling
        const completedStep = page.locator('span.line-through:has-text("Intro to Python")');
        await expect(completedStep).toBeVisible();

        const completedStep2 = page.locator('span.line-through:has-text("Data Structures")');
        await expect(completedStep2).toBeVisible();
    });

    test('should show pending state for last 2 steps', async ({ page }) => {
        // Pending steps do NOT have line-through
        const pendingStep = page.locator('span:has-text("OOP Concepts"):not(.line-through)');
        await expect(pendingStep).toBeVisible();

        const pendingStep2 = page.locator('span:has-text("Decorators & Generators"):not(.line-through)');
        await expect(pendingStep2).toBeVisible();
    });
});

test.describe('Focus Timer Widget', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display timer topic', async ({ page }) => {
        const topic = page.locator('text=FastAPI Basics');
        await expect(topic).toBeVisible();
    });

    test('should display Focus Timer label', async ({ page }) => {
        const label = page.locator('text=Focus Timer');
        await expect(label).toBeVisible();
    });

    test('should display initial time as 00:00', async ({ page }) => {
        const time = page.locator('text=00:00');
        await expect(time).toBeVisible();
    });

    test('should have functional play/pause toggle', async ({ page }) => {
        // Status should initially show "Paused"
        const paused = page.locator('text=Paused');
        await expect(paused).toBeVisible();

        // Click the play button (the round indigo button)
        const playBtn = page.locator('button:has(svg.lucide-play)');
        await playBtn.click();

        // After click, status should change to "Recording..."
        const recording = page.locator('text=Recording...');
        await expect(recording).toBeVisible();
    });
});

test.describe('Quick Note Widget', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display Quick Notes header', async ({ page }) => {
        const header = page.locator('text=Quick Notes');
        await expect(header).toBeVisible();
    });

    test('should display AI Assist button', async ({ page }) => {
        const aiButton = page.locator('text=AI Assist');
        await expect(aiButton).toBeVisible();
    });

    test('should have a functional textarea', async ({ page }) => {
        const textarea = page.locator('textarea');
        await expect(textarea).toBeVisible();

        // Use click + type to ensure React onChange fires for Zustand-bound input
        await textarea.click();
        await textarea.pressSequentially('My test note');
        await expect(textarea).toHaveValue('My test note');
    });

    test('should display markdown supported label', async ({ page }) => {
        const markdown = page.locator('text=markdown supported');
        await expect(markdown).toBeVisible();
    });

    test('should update character counter on typing', async ({ page }) => {
        const counter = page.getByText('0 chars');
        await expect(counter).toBeVisible();

        const textarea = page.locator('textarea');
        await textarea.click();
        await textarea.pressSequentially('hello');

        // Wait for Zustand store + Framer Motion re-render
        await expect(page.getByText('5 chars')).toBeVisible({ timeout: 10000 });
    });
});
