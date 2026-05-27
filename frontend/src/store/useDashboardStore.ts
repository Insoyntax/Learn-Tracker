import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Step {
    id: number;
    title: string;
    isCompleted: boolean;
}

export interface FamiliarStats {
    level: number;
    currentHp: number;
    maxHp: number;
    lastFedAt: string; // ISO string
}

export interface UserStats {
    xp: number;
    level: number;
    streak: number;
    maxXp: number;
    xpByCategory: Record<string, number>;
    familiar: FamiliarStats;
}

export interface Roadmap {
    id: number;
    title: string;
    category: string;
    steps: Step[];
    progress: number;
}

export type ResourceType = 'Video' | 'Article' | 'Repo' | 'Documentation' | string;

export interface Resource {
    id: number;
    title: string;
    url: string;
    type: ResourceType;
    category: string;
    roadmapId?: number;
    isConsumed: boolean;
}

export interface StudyLog {
    id: string; // uuid
    date: string; // ISO string
    durationMinutes: number;
    category: string;
    notes?: string;
    type: 'auto' | 'manual';
}

export interface StudyTimer {
    isRunning: boolean;
    timeElapsed: number; // in seconds
    topic: string;
    targetMinutes: number;
    targetReached: boolean;
    category: string;
}

export interface Quest {
    id: string; // uuid
    title: string;
    rank: 'S' | 'A' | 'B' | 'C';
    xpReward: number; // S=500, A=250, B=100, C=50
    isCompleted: boolean;
}

export interface Flashcard {
    id: string; // uuid
    front: string;
    back: string;
    categoryId: string; // dynamic tag
    nextReviewDate: string; // ISO string
    interval: number; // in days
    easeFactor: number;
}

export interface QuickNotes {
    content: string;
    savedNotes: string[];
    isSaved: boolean;
}

export interface InventoryItem {
    id: string; // uuid
    title: string;
    type: 'code' | 'text' | 'link';
    content: string;
    categoryId: string; // dynamic tag
    createdAt: string; // ISO string
}

export type StudioTaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';

export interface StudioTask {
    id: string; // uuid
    title: string;
    description?: string;
    status: StudioTaskStatus;
    categoryId: string; // dynamic tag
    createdAt: string; // ISO string
}

export interface AppSettings {
    accentColor: string;
    soundEnabled: boolean;
    userName: string;
    defaultTimerMinutes: number;
}

export interface DashboardLayoutItem {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    maxW?: number;
    minH?: number;
    maxH?: number;
}

interface DashboardState {
    userStats: UserStats;
    roadmaps: Roadmap[];
    resources: Resource[];
    studyLogs: StudyLog[];
    categories: string[];
    resourceTypes: string[];
    activeRoadmapId: number | null;

    // Settings
    settings: AppSettings;

    // Layout State
    layout: DashboardLayoutItem[];
    isEditMode: boolean;
    availableWidgets: string[];

    studyTimer: StudyTimer;
    quickNotes: QuickNotes;
    quests: Quest[];
    lastRerollDate: string | null;
    flashcards: Flashcard[];
    inventoryItems: InventoryItem[];
    studioTasks: StudioTask[];

    // Actions
    fetchInitialData: () => Promise<void>;
    createRoadmap: (roadmap: Omit<Roadmap, "id" | "progress">) => void;
    deleteRoadmap: (id: number) => void;
    setActiveRoadmap: (id: number) => void;
    toggleStep: (roadmapId: number, stepId: number) => void;
    resetRoadmap: (roadmapId: number) => void;

    // Familiar Actions
    feedFamiliar: (amount: number) => void;

    // Resource Actions
    addResource: (resource: Omit<Resource, "id" | "isConsumed">) => void;
    deleteResource: (id: number) => void;
    toggleResourceConsumed: (id: number) => void;

    // Timer & Log Actions
    toggleTimer: () => void;
    tickTimer: () => void;
    resetTimer: () => void;
    finishSession: () => void;
    setTargetMinutes: (minutes: number) => void;
    setTimerCategory: (category: string) => void;

    // Log Actions
    addStudyLog: (log: Omit<StudyLog, "id">) => void;

    // Note Actions
    setNoteContent: (content: string) => void;
    saveNote: () => void;

    // Quest Actions
    isGeneratingQuests: boolean;
    generateDailyQuests: (context?: string) => Promise<void>;
    rerollQuests: (context?: string) => Promise<void>;
    completeQuest: (id: string) => void;
    addXp: (amount: number) => void;

    // Flashcard Actions
    addFlashcard: (data: Omit<Flashcard, "id" | "nextReviewDate" | "interval" | "easeFactor">) => void;
    deleteFlashcard: (id: string) => void;
    reviewFlashcard: (id: string, quality: number) => void;

    // Inventory Actions
    addInventoryItem: (data: Omit<InventoryItem, "id" | "createdAt">) => void;
    deleteInventoryItem: (id: string) => void;

    // Studio Actions
    addStudioTask: (data: Omit<StudioTask, "id" | "createdAt" | "status">) => void;
    moveStudioTask: (id: string, newStatus: StudioTaskStatus) => void;
    deleteStudioTask: (id: string) => void;

    // Settings Actions
    updateSettings: (settings: Partial<AppSettings>) => void;
    resetData: () => void;

    // Layout Actions
    updateLayout: (layout: DashboardLayoutItem[]) => void;
    toggleEditMode: () => void;
    addWidget: (widgetId: string) => void;
    removeWidget: (widgetId: string) => void;
    resetLayout: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const recalcProgress = (steps: Step[]): number => {
    if (steps.length === 0) return 0;
    return Math.round((steps.filter((s) => s.isCompleted).length / steps.length) * 100);
};

const levelUp = (stats: UserStats, xpToAdd: number): UserStats => {
    let { xp, level, maxXp, xpByCategory, familiar } = stats;
    xp += xpToAdd;
    while (xp >= maxXp) {
        xp -= maxXp;
        level += 1;
        maxXp = Math.round(maxXp * 1.5);
    }
    return { ...stats, xp, level, maxXp, xpByCategory, familiar };
};

export const getCategoryLevelInfo = (xp: number) => {
    let level = 1;
    let currentMax = 100;
    let remainingXp = xp;

    while (remainingXp >= currentMax) {
        remainingXp -= currentMax;
        level++;
        currentMax = Math.round(currentMax * 1.5);
    }

    return {
        level,
        currentXp: remainingXp,
        nextLevelXp: currentMax,
        progress: Math.min((remainingXp / currentMax) * 100, 100)
    };
};

const INITIAL_TYPES = ["Article", "Video", "Repo", "Documentation"];

// Default Layout Definition (12-column grid)
const DEFAULT_LAYOUT: DashboardLayoutItem[] = [
    { i: "streak", x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 },      // Stats
    { i: "roadmap", x: 3, y: 0, w: 6, h: 2, minW: 4, minH: 2 },     // Active Roadmap
    { i: "timer", x: 9, y: 0, w: 3, h: 1, minW: 2, minH: 1 },       // Timer
    { i: "daily_goals", x: 9, y: 1, w: 3, h: 1, minW: 2, minH: 1 }, // Goals
    { i: "quick_note", x: 0, y: 2, w: 12, h: 1, minW: 4, minH: 1 }, // Notes
];

const INITIAL_WIDGETS = [
    "streak", "roadmap", "timer", "daily_goals", "quick_note",
    "quote", "analytics", "familiar" // New extra widgets
];

// ─── Store ────────────────────────────────────────────────────────────────────

export const useDashboardStore = create<DashboardState>()(
    persist(
        (set, get) => ({
            userStats: {
                xp: 0,
                level: 1,
                streak: 0,
                maxXp: 500,
                xpByCategory: {},
                familiar: {
                    level: 1,
                    currentHp: 100,
                    maxHp: 100,
                    lastFedAt: new Date().toISOString()
                }
            },

            roadmaps: [],
            resources: [],
            studyLogs: [],
            categories: [],
            resourceTypes: INITIAL_TYPES,
            activeRoadmapId: null,

            settings: {
                accentColor: "violet",
                soundEnabled: true,
                userName: "Student",
                defaultTimerMinutes: 25,
            },

            // Layout defaults
            layout: DEFAULT_LAYOUT,
            isEditMode: false,
            availableWidgets: INITIAL_WIDGETS,

            studyTimer: {
                isRunning: false,
                timeElapsed: 0,
                topic: "Focus Session",
                category: "",
                targetMinutes: 25, // overridden by settings.defaultTimerMinutes on mount
                targetReached: false,
            },

            quickNotes: {
                content: "",
                savedNotes: [],
                isSaved: false,
            },

            quests: [],
            lastRerollDate: null,
            isGeneratingQuests: false,
            flashcards: [],
            inventoryItems: [],
            studioTasks: [],

            // ── Actions ──────────────────────────────────────────────────────────────

            createRoadmap: (data) =>
                set((state) => {
                    const newId = state.roadmaps.length > 0 ? Math.max(...state.roadmaps.map((r) => r.id)) + 1 : 1;
                    const newRoadmap: Roadmap = {
                        ...data,
                        id: newId,
                        progress: 0,
                    };
                    const updatedRoadmaps = [...state.roadmaps, newRoadmap];

                    const newActiveId = state.activeRoadmapId === null ? newId : state.activeRoadmapId;

                    const categoryExists = state.categories.includes(data.category);
                    const updatedCategories = categoryExists ? state.categories : [...state.categories, data.category];

                    return {
                        roadmaps: updatedRoadmaps,
                        activeRoadmapId: newActiveId,
                        categories: updatedCategories,
                    };
                }),

            deleteRoadmap: (id) =>
                set((state) => {
                    const updatedRoadmaps = state.roadmaps.filter((r) => r.id !== id);

                    let newActiveId = state.activeRoadmapId;

                    if (id === state.activeRoadmapId) {
                        if (updatedRoadmaps.length > 0) {
                            newActiveId = updatedRoadmaps[0].id;
                        } else {
                            newActiveId = null;
                        }
                    }

                    return {
                        roadmaps: updatedRoadmaps,
                        activeRoadmapId: newActiveId,
                    };
                }),

            setActiveRoadmap: (id) =>
                set((state) => {
                    const found = state.roadmaps.find((r) => r.id === id);
                    if (!found) return {};
                    return {
                        activeRoadmapId: id,
                    };
                }),

            toggleStep: (roadmapId, stepId) =>
                set((state) => {
                    const roadmapIndex = state.roadmaps.findIndex((r) => r.id === roadmapId);
                    if (roadmapIndex === -1) return {};

                    const roadmap = state.roadmaps[roadmapIndex];
                    const steps = roadmap.steps.map((s) =>
                        s.id === stepId ? { ...s, isCompleted: !s.isCompleted } : s
                    );

                    const toggledStep = roadmap.steps.find((s) => s.id === stepId);
                    const wasCompleted = toggledStep?.isCompleted ?? false;

                    const newProgress = recalcProgress(steps);
                    const updatedRoadmap = { ...roadmap, steps, progress: newProgress };
                    const updatedRoadmaps = [...state.roadmaps];
                    updatedRoadmaps[roadmapIndex] = updatedRoadmap;

                    updatedRoadmaps[roadmapIndex] = updatedRoadmap;

                    const xpDelta = wasCompleted ? -50 : 50;

                    let newStats = xpDelta > 0
                        ? levelUp(state.userStats, xpDelta)
                        : { ...state.userStats, xp: Math.max(0, state.userStats.xp + xpDelta) };

                    const currentCatXp = newStats.xpByCategory[roadmap.category] || 0;
                    const newCatXp = Math.max(0, currentCatXp + xpDelta);

                    newStats = {
                        ...newStats,
                        xpByCategory: {
                            ...newStats.xpByCategory,
                            [roadmap.category]: newCatXp
                        }
                    };

                    return {
                        roadmaps: updatedRoadmaps,
                        userStats: newStats,
                    };
                }),

            resetRoadmap: (roadmapId) =>
                set((state) => {
                    const roadmapIndex = state.roadmaps.findIndex((r) => r.id === roadmapId);
                    if (roadmapIndex === -1) return {};

                    const roadmap = state.roadmaps[roadmapIndex];
                    const steps = roadmap.steps.map((s) => ({ ...s, isCompleted: false }));

                    const updatedRoadmap = { ...roadmap, steps, progress: 0 };
                    const updatedRoadmaps = [...state.roadmaps];
                    updatedRoadmaps[roadmapIndex] = updatedRoadmap;

                    return {
                        roadmaps: updatedRoadmaps,
                    };
                }),

            // ── Familiar Actions ─────────────────────────────────────────────────────
            feedFamiliar: async (amount) => {
                const state = get();
                if (!state.userStats.familiar) return;

                const currentHp = state.userStats.familiar.currentHp;
                const maxHp = state.userStats.familiar.maxHp;
                const newHp = Math.min(currentHp + amount, maxHp);
                const lastFedAt = new Date().toISOString();

                try {
                    await api.put('/familiar/feed', {
                        current_hp: newHp,
                        last_fed_at: lastFedAt
                    });

                    set((s) => ({
                        userStats: {
                            ...s.userStats,
                            familiar: {
                                ...s.userStats.familiar,
                                currentHp: newHp,
                                lastFedAt
                            }
                        }
                    }));
                } catch (error) {
                    console.error("Failed to feed familiar:", error);
                }
            },

            // ── Resource Actions ─────────────────────────────────────────────────────

            addResource: (data) =>
                set((state) => {
                    const newId = state.resources.length > 0 ? Math.max(...state.resources.map(r => r.id)) + 1 : 1;
                    const newResource: Resource = {
                        ...data,
                        id: newId,
                        isConsumed: false,
                    };

                    const newState: Partial<DashboardState> = {
                        resources: [newResource, ...state.resources],
                    };

                    if (!state.categories.includes(data.category)) {
                        newState.categories = [...state.categories, data.category];
                    }

                    if (!state.resourceTypes.includes(data.type)) {
                        newState.resourceTypes = [...state.resourceTypes, data.type];
                    }

                    return newState;
                }),

            deleteResource: (id) =>
                set((state) => ({
                    resources: state.resources.filter((r) => r.id !== id),
                })),

            toggleResourceConsumed: (id) =>
                set((state) => {
                    const resourceIndex = state.resources.findIndex((r) => r.id === id);
                    if (resourceIndex === -1) return {};

                    const resource = state.resources[resourceIndex];
                    const wasConsumed = resource.isConsumed;

                    const updatedResource = { ...resource, isConsumed: !wasConsumed };
                    const updatedResources = [...state.resources];
                    updatedResources[resourceIndex] = updatedResource;

                    const xpDelta = wasConsumed ? -15 : 15;

                    let newStats = xpDelta > 0
                        ? levelUp(state.userStats, xpDelta)
                        : { ...state.userStats, xp: Math.max(0, state.userStats.xp + xpDelta) };

                    const currentCatXp = newStats.xpByCategory[resource.category] || 0;
                    const newCatXp = Math.max(0, currentCatXp + xpDelta);

                    newStats = {
                        ...newStats,
                        xpByCategory: {
                            ...newStats.xpByCategory,
                            [resource.category]: newCatXp
                        }
                    };

                    return {
                        resources: updatedResources,
                        userStats: newStats,
                    };
                }),

            // ── Study Logs & Timer Actions ──────────────────────────────────────────

            addStudyLog: (data) =>
                set((state) => {
                    const newLog: StudyLog = {
                        ...data,
                        id: crypto.randomUUID(),
                    };
                    const categoryExists = state.categories.includes(data.category);
                    const updatedCategories = categoryExists ? state.categories : [...state.categories, data.category];

                    return {
                        studyLogs: [newLog, ...state.studyLogs],
                        categories: updatedCategories
                    };
                }),

            addXp: (amount) =>
                set((state) => ({
                    userStats: levelUp(state.userStats, amount),
                })),

            toggleTimer: () =>
                set((state) => ({
                    studyTimer: {
                        ...state.studyTimer,
                        isRunning: !state.studyTimer.isRunning,
                    },
                })),

            tickTimer: () =>
                set((state) => {
                    const newTime = state.studyTimer.timeElapsed + 1;
                    const targetSeconds = state.studyTimer.targetMinutes * 60;
                    return {
                        studyTimer: {
                            ...state.studyTimer,
                            timeElapsed: newTime,
                            targetReached: newTime >= targetSeconds,
                        },
                    };
                }),

            resetTimer: () =>
                set((state) => ({
                    studyTimer: {
                        ...state.studyTimer,
                        isRunning: false,
                        timeElapsed: 0,
                        targetReached: false,
                    },
                })),

            finishSession: () =>
                set((state) => {
                    const { timeElapsed, topic, category } = state.studyTimer;
                    const durationMinutes = Math.floor(timeElapsed / 60);

                    if (durationMinutes < 1) {
                        return {
                            studyTimer: {
                                ...state.studyTimer,
                                running: false,
                                isRunning: false,
                                timeElapsed: 0,
                                targetReached: false,
                            }
                        };
                    }

                    const newLog: StudyLog = {
                        id: crypto.randomUUID(),
                        date: new Date().toISOString(),
                        durationMinutes,
                        category,
                        notes: `Focused session on ${topic}`,
                        type: 'auto',
                    };

                    const xpEarned = durationMinutes * 10;
                    let newStats = levelUp(state.userStats, xpEarned);

                    const currentCatXp = newStats.xpByCategory[category] || 0;
                    const newCatXp = currentCatXp + xpEarned;
                    newStats = {
                        ...newStats,
                        xpByCategory: {
                            ...newStats.xpByCategory,
                            [category]: newCatXp
                        }
                    };

                    const categoryExists = state.categories.includes(category);
                    const updatedCategories = categoryExists || !category ? state.categories : [...state.categories, category];

                    setTimeout(() => { get().feedFamiliar(20); }, 0);

                    return {
                        studyLogs: [newLog, ...state.studyLogs],
                        userStats: newStats,
                        studyTimer: {
                            ...state.studyTimer,
                            isRunning: false,
                            timeElapsed: 0,
                            targetReached: false,
                        },
                        categories: updatedCategories
                    };
                }),

            setTargetMinutes: (minutes) =>
                set((state) => ({
                    studyTimer: {
                        ...state.studyTimer,
                        targetMinutes: minutes,
                        targetReached: state.studyTimer.timeElapsed >= minutes * 60,
                    },
                })),

            setTimerCategory: (category) =>
                set((state) => ({
                    studyTimer: {
                        ...state.studyTimer,
                        category,
                    },
                })),

            setNoteContent: (content) =>
                set((state) => ({
                    quickNotes: { ...state.quickNotes, content, isSaved: false },
                })),

            saveNote: () =>
                set((state) => {
                    const trimmed = state.quickNotes.content.trim();
                    if (!trimmed) return state;
                    return {
                        quickNotes: {
                            content: "",
                            savedNotes: [trimmed, ...state.quickNotes.savedNotes],
                            isSaved: true,
                        },
                    };
                }),

            fetchInitialData: async () => {
                try {
                    const [projects, flashcards, inventoryItems, quests, studioTasks, dashboardLayout, familiarState] = await Promise.all([
                        api.get('/projects/'),
                        api.get('/flashcards/'),
                        api.get('/inventory/'),
                        api.get('/quests/'),
                        api.get('/studio/'),
                        api.get('/dashboard/layout/'),
                        api.get('/familiar/')
                    ]);

                    const currentStats = get().userStats;
                    const safeXp = isNaN(currentStats.xp) ? 0 : currentStats.xp;
                    const safeMaxXp = isNaN(currentStats.maxXp) || currentStats.maxXp === 0 ? 500 : currentStats.maxXp;

                    set({
                        // @ts-ignore - Map snake_case to camelCase
                        quests: Array.isArray(quests) ? quests.map(q => ({ ...q, xpReward: q.xp_reward, isCompleted: q.is_completed })) : [],
                        flashcards: Array.isArray(flashcards) ? flashcards.map(f => ({ ...f, categoryId: String(f.category_id), nextReviewDate: f.next_review_date, easeFactor: f.ease_factor })) : [],
                        // @ts-ignore
                        inventoryItems: Array.isArray(inventoryItems) ? inventoryItems.map(i => ({ ...i, categoryId: String(i.category_id), createdAt: i.created_at })) : [],
                        // @ts-ignore
                        studioTasks: Array.isArray(studioTasks) ? studioTasks.map(t => ({ ...t, categoryId: String(t.category_id), createdAt: t.created_at })) : [],
                        // @ts-ignore
                        layout: dashboardLayout && dashboardLayout.layout_data ? JSON.parse(dashboardLayout.layout_data) : get().layout,
                        userStats: {
                            ...currentStats,
                            xp: safeXp,
                            maxXp: safeMaxXp,
                            // @ts-ignore
                            familiar: (familiarState as any) ? {
                                level: (familiarState as any).level,
                                currentHp: (familiarState as any).current_hp,
                                maxHp: (familiarState as any).max_hp,
                                lastFedAt: (familiarState as any).last_fed_at
                            } : currentStats.familiar
                        }
                    });
                } catch (error) {
                    console.error("Failed to fetch initial data:", error);
                    toast.error("Failed to load user data from backend.");
                }
            },

            completeQuest: async (id) => {
                const state = get();
                const questIndex = state.quests.findIndex(q => q.id === id);
                if (questIndex === -1 || state.quests[questIndex].isCompleted) return;

                const quest = state.quests[questIndex];

                try {
                    // Optimistic update isn't used here (per plan: pessimistic), but waiting for 200 OK
                    await api.put(`/quests/${id}/complete`, { is_completed: true });

                    const xpDelta = quest.xpReward;
                    const newStats = levelUp(state.userStats, xpDelta);

                    const updatedQuests = [...state.quests];
                    updatedQuests[questIndex] = { ...quest, isCompleted: true };

                    set({
                        quests: updatedQuests,
                        userStats: newStats
                    });
                    toast.success(`Completed "${quest.title}" and earned ${xpDelta} XP!`);

                    setTimeout(() => { get().feedFamiliar(20); }, 0);

                } catch (error) {
                    console.error("Failed to complete quest:", error);
                    toast.error("Failed to complete quest.");
                }
            },

            generateDailyQuests: async (context?: string) => {
                set({ isGeneratingQuests: true });

                const generateQuestPayload = (rank: 'S' | 'A' | 'B' | 'C', title: string) => {
                    const rewards = { 'S': 500, 'A': 250, 'B': 100, 'C': 50 };
                    return {
                        title: title,
                        rank: rank,
                        xp_reward: rewards[rank],
                        is_completed: false
                    };
                };

                const topic = context || "General Learning";

                // RNG weighting: 5% S, 10% A, 40% B, 45% C
                const rollRank = () => {
                    const r = Math.random();
                    if (r > 0.95) return 'S';
                    if (r > 0.85) return 'A';
                    if (r > 0.45) return 'B';
                    return 'C';
                };

                const templates = {
                    'S': [`Master advanced concepts in ${topic}`, `Build a complete project using ${topic}`],
                    'A': [`Deep dive into ${topic} documentation`, `Refactor existing ${topic} codebase`],
                    'B': [`Review ${topic} flashcards`, `Log a 45m focused session for ${topic}`],
                    'C': [`Read one article about ${topic}`, `Organize ${topic} notes`]
                };

                const generateRandomQuestPayload = () => {
                    const rank = rollRank() as 'S' | 'A' | 'B' | 'C';
                    const titleList = templates[rank];
                    const title = titleList[Math.floor(Math.random() * titleList.length)];
                    return generateQuestPayload(rank, title);
                };

                try {
                    // Optional: Clean up old active quests from database so they don't pile up
                    const state = get();
                    const activeQuests = state.quests.filter(q => !q.isCompleted);
                    await Promise.allSettled(activeQuests.map(q => api.delete(`/quests/${q.id}`)));

                    const payloads = [
                        generateRandomQuestPayload(),
                        generateRandomQuestPayload(),
                        generateRandomQuestPayload(),
                        generateRandomQuestPayload()
                    ];

                    const newQuestsResponses = await Promise.all(
                        payloads.map(payload => api.post<any>('/quests/', payload))
                    );

                    const newQuests: Quest[] = newQuestsResponses.map(res => ({
                        id: String(res.id),
                        title: res.title,
                        rank: res.rank,
                        xpReward: res.xp_reward,
                        isCompleted: res.is_completed
                    }));

                    set({ quests: newQuests, lastRerollDate: new Date().toISOString(), isGeneratingQuests: false });
                } catch (error) {
                    console.error("Failed to generate quests:", error);
                    toast.error("Network error generating quests.");
                    set({ isGeneratingQuests: false });
                }
            },

            rerollQuests: async (context?: string) => {
                const state = get();
                if (state.userStats.xp >= 50) {
                    set({ userStats: { ...state.userStats, xp: state.userStats.xp - 50 } });
                    await get().generateDailyQuests(context);
                }
            },

            // ── Flashcard Actions ────────────────────────────────────────────────────

            addFlashcard: async (data) => {
                const state = get();
                try {
                    // Python backend expects category_id as integer. Parse it.
                    const payload = {
                        front: data.front,
                        back: data.back,
                        category_id: parseInt(data.categoryId, 10) || 1, // Fallback safely
                    };

                    const response = await api.post<any>('/flashcards/', payload);

                    const newCard: Flashcard = {
                        id: String(response.id),
                        front: response.front,
                        back: response.back,
                        categoryId: String(response.category_id),
                        nextReviewDate: response.next_review_date,
                        interval: response.interval,
                        easeFactor: response.ease_factor,
                    };

                    const categoryExists = state.categories.includes(data.categoryId);
                    const updatedCategories = categoryExists ? state.categories : [...state.categories, data.categoryId];

                    set({
                        flashcards: [...state.flashcards, newCard],
                        categories: updatedCategories,
                    });
                    toast.success("Flashcard securely added!");
                } catch (error) {
                    console.error("Failed to add flashcard:", error);
                    toast.error("Failed to add flashcard.");
                }
            },

            deleteFlashcard: async (id) => {
                try {
                    await api.delete(`/flashcards/${id}`);
                    set((state) => ({
                        flashcards: state.flashcards.filter((f) => f.id !== id),
                    }));
                    toast.success("Flashcard burned!");
                } catch (error) {
                    console.error("Failed to delete flashcard:", error);
                    toast.error("Failed to delete flashcard.");
                }
            },

            reviewFlashcard: async (id, quality) => {
                const state = get();
                const cardIndex = state.flashcards.findIndex((f) => f.id === id);
                if (cardIndex === -1) return;

                const card = state.flashcards[cardIndex];
                let newInterval = card.interval;
                let newEaseFactor = card.easeFactor;

                // SM-2 Algorithm
                if (quality < 3) {
                    newInterval = 1;
                } else {
                    if (card.interval === 0) {
                        newInterval = 1;
                    } else if (card.interval === 1) {
                        newInterval = 6;
                    } else {
                        newInterval = Math.round(card.interval * card.easeFactor);
                    }
                }

                newEaseFactor = card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
                if (newEaseFactor < 1.3) newEaseFactor = 1.3;

                const nextReview = new Date();
                nextReview.setDate(nextReview.getDate() + newInterval);

                try {
                    // Send strictly algorithm outputs to FastAPI DB
                    const payload = {
                        next_review_date: nextReview.toISOString(),
                        interval: newInterval,
                        ease_factor: newEaseFactor,
                    };

                    await api.put(`/flashcards/${id}/review`, payload);

                    const updatedCard = {
                        ...card,
                        interval: newInterval,
                        easeFactor: newEaseFactor,
                        nextReviewDate: nextReview.toISOString(),
                    };

                    const updatedFlashcards = [...state.flashcards];
                    updatedFlashcards[cardIndex] = updatedCard;

                    // Grant +5 XP per review
                    const xpEarned = 5;
                    let newStats = levelUp(state.userStats, xpEarned);
                    const catXp = newStats.xpByCategory[card.categoryId] || 0;
                    newStats = {
                        ...newStats,
                        xpByCategory: {
                            ...newStats.xpByCategory,
                            [card.categoryId]: catXp + xpEarned
                        }
                    };

                    set({
                        flashcards: updatedFlashcards,
                        userStats: newStats
                    });
                } catch (error) {
                    console.error("Failed to log review:", error);
                    toast.error("Network error saving review progress.");
                }
            },

            // ── Inventory Actions ────────────────────────────────────────────────────

            addInventoryItem: async (data) => {
                const state = get();
                try {
                    const payload = {
                        title: data.title,
                        type: data.type,
                        content: data.content,
                        category_id: parseInt(data.categoryId, 10) || 1,
                    };
                    const response = await api.post<any>('/inventory/', payload);

                    const newItem: InventoryItem = {
                        id: String(response.id),
                        title: response.title,
                        type: response.type as 'code' | 'text' | 'link',
                        content: response.content,
                        categoryId: String(response.category_id),
                        createdAt: response.created_at,
                    };

                    const categoryExists = state.categories.includes(data.categoryId);
                    const updatedCategories = categoryExists ? state.categories : [...state.categories, data.categoryId];

                    set({
                        inventoryItems: [newItem, ...state.inventoryItems],
                        categories: updatedCategories
                    });
                    toast.success("Added to Vault!");
                } catch (error) {
                    console.error("Failed to add inventory item:", error);
                    toast.error("Failed to add item to Vault.");
                }
            },

            deleteInventoryItem: async (id) => {
                try {
                    await api.delete(`/inventory/${id}`);
                    set((state) => ({
                        inventoryItems: state.inventoryItems.filter((i) => i.id !== id)
                    }));
                    toast.success("Item removed from Vault.");
                } catch (error) {
                    console.error("Failed to delete inventory item:", error);
                    toast.error("Failed to remove item.");
                }
            },

            // ── Studio Actions ───────────────────────────────────────────────────────

            addStudioTask: async (data) => {
                const state = get();
                try {
                    const payload = {
                        title: data.title,
                        description: data.description || "",
                        category_id: parseInt(data.categoryId, 10) || 1,
                        status: 'TODO'
                    };
                    const response = await api.post<any>('/studio/', payload);

                    const newTask: StudioTask = {
                        id: String(response.id),
                        title: response.title,
                        description: response.description,
                        status: response.status as StudioTaskStatus,
                        categoryId: String(response.category_id),
                        createdAt: response.created_at,
                    };
                    const categoryExists = state.categories.includes(data.categoryId);
                    const updatedCategories = categoryExists ? state.categories : [...state.categories, data.categoryId];
                    set({
                        studioTasks: [...state.studioTasks, newTask],
                        categories: updatedCategories,
                    });
                } catch (error) {
                    console.error("Failed to add studio task:", error);
                    toast.error("Failed to add task.");
                }
            },

            moveStudioTask: async (id, newStatus) => {
                const state = get();
                const taskIndex = state.studioTasks.findIndex(t => t.id === id);
                if (taskIndex === -1) return;

                const task = state.studioTasks[taskIndex];
                if (task.status === newStatus) return;

                try {
                    await api.put(`/studio/${id}`, { status: newStatus });

                    const updatedTasks = [...state.studioTasks];
                    updatedTasks[taskIndex] = { ...task, status: newStatus };

                    let newStats = state.userStats;
                    // Provide micro gamification reward internally if completing a task
                    if (newStatus === 'DONE' && task.status !== 'DONE') {
                        const xpDelta = 20;
                        newStats = levelUp(state.userStats, xpDelta);
                        const currentCatXp = newStats.xpByCategory[task.categoryId] || 0;
                        newStats = {
                            ...newStats,
                            xpByCategory: {
                                ...newStats.xpByCategory,
                                [task.categoryId]: currentCatXp + xpDelta
                            }
                        };
                        toast.success(`Task Completed! +${xpDelta} XP 🔥`, { id: 'task-completed-xp' });
                    }

                    set({
                        studioTasks: updatedTasks,
                        userStats: newStats
                    });
                } catch (error) {
                    console.error("Failed to move studio task:", error);
                    toast.error("Network error moving task.");
                }
            },

            deleteStudioTask: async (id) => {
                try {
                    await api.delete(`/studio/${id}`);
                    set((state) => ({
                        studioTasks: state.studioTasks.filter(t => t.id !== id)
                    }));
                } catch (error) {
                    console.error("Failed to delete studio task:", error);
                    toast.error("Failed to delete task.");
                }
            },

            // ── Settings Actions ─────────────────────────────────────────────────────

            updateSettings: (newSettings) =>
                set((state) => ({
                    settings: { ...state.settings, ...newSettings }
                })),

            resetData: () => {
                // Clear persisted storage and reload
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('dashboard-storage');
                    window.location.reload();
                }
            },

            // ── Layout Actions ───────────────────────────────────────────────────────

            updateLayout: async (layout) => {
                set({ layout }); // Optimistically update since Grid relies on rapid updates
                try {
                    await api.put('/dashboard/layout/', { layout_data: JSON.stringify(layout) });
                } catch (error) {
                    console.error("Failed to save layout to DB", error);
                }
            },

            toggleEditMode: () =>
                set((state) => ({
                    isEditMode: !state.isEditMode,
                })),

            addWidget: (widgetId) =>
                set((state) => {
                    if (state.layout.some(l => l.i === widgetId)) return state;
                    const newItem: DashboardLayoutItem = {
                        i: widgetId,
                        x: 0,
                        y: Infinity,
                        w: 2,
                        h: 2,
                    };
                    return {
                        layout: [...state.layout, newItem],
                    };
                }),

            removeWidget: (widgetId) =>
                set((state) => ({
                    layout: state.layout.filter(l => l.i !== widgetId),
                })),

            resetLayout: () =>
                set({ layout: DEFAULT_LAYOUT }),
        }),
        {
            name: "dashboard-storage",

            partialize: (state) => ({
                userStats: state.userStats,
                roadmaps: state.roadmaps,
                resources: state.resources,
                studyLogs: state.studyLogs,
                categories: state.categories,
                activeRoadmapId: state.activeRoadmapId,
                quests: state.quests,
                lastRerollDate: state.lastRerollDate,
                isGeneratingQuests: false,
                quickNotes: state.quickNotes,
                settings: state.settings,
                layout: state.layout,
                resourceTypes: state.resourceTypes,
                flashcards: state.flashcards,
                inventoryItems: state.inventoryItems,
                studioTasks: state.studioTasks,
            }),
            storage: createJSONStorage(() =>
                typeof window !== "undefined" ? localStorage : {
                    getItem: () => null,
                    setItem: () => { },
                    removeItem: () => { },
                }
            ),
        }
    )
);
