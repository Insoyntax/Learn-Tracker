import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { focus } = await req.json();

        // Base date for schedule (tomorrow at 10 AM)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);

        const endTomorrow = new Date(tomorrow);
        endTomorrow.setHours(12, 0, 0, 0);

        let roadmapTitle = "General Studies Mastery";
        let tasks = [
            "Organize Study Materials",
            "Set up weekly schedule",
            "Review first lecture"
        ];

        if (focus === "Software Engineering") {
            roadmapTitle = "Fullstack Developer Journey";
            tasks = [
                "Setup Next.js environment",
                "Learn Zustand state management",
                "Build first API route"
            ];
        } else if (focus === "Design") {
            roadmapTitle = "UI/UX Design Systems";
            tasks = [
                "Create color palette",
                "Design Wireframes in Figma",
                "Study Matte Dark aesthetic"
            ];
        } else if (focus === "Language") {
            roadmapTitle = "English Fluency Path";
            tasks = [
                "Practice vocabulary list 1",
                "Watch 1 hour without subtitles",
                "Write introductory essay"
            ];
        }

        const payload = {
            roadmap: {
                id: crypto.randomUUID(),
                title: roadmapTitle,
                description: `A starter roadmap focused on ${focus}.`,
                progress: 0,
                totalNodes: 5,
                completedNodes: 0,
                color: 'cyan',
                tags: [focus, 'Starter'],
                createdAt: new Date().toISOString()
            },
            studioTasks: tasks.map(t => ({
                id: crypto.randomUUID(),
                title: t,
                description: `Starter task for ${focus}`,
                status: 'TODO',
                categoryId: focus,
                createdAt: new Date().toISOString()
            })),
            scheduleBlock: {
                id: crypto.randomUUID(),
                title: `${focus} Deep Work`,
                startTime: tomorrow.toISOString(),
                endTime: endTomorrow.toISOString(),
                referenceType: 'custom'
            }
        };

        return NextResponse.json({ success: true, data: payload });

    } catch (error) {
        console.error("Seeding Error:", error);
        return NextResponse.json({ success: false, error: "Failed to seed starter kit." }, { status: 500 });
    }
}
