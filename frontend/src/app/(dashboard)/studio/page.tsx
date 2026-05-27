"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, ListTodo, Settings, Search, CheckCircle2 } from "lucide-react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import { useDashboardStore, StudioTask, StudioTaskStatus } from "@/store/useDashboardStore";

import { KanbanColumn } from "@/components/studio/KanbanColumn";
import { TaskCard } from "@/components/studio/TaskCard";
import { AddStudioTaskModal } from "@/components/studio/AddStudioTaskModal";

const COLUMNS: { id: StudioTaskStatus; title: string; icon: React.ReactNode }[] = [
    { id: 'TODO', title: "To Do", icon: <ListTodo className="w-4 h-4 text-emerald-400" /> },
    { id: 'IN_PROGRESS', title: "In Progress", icon: <Settings className="w-4 h-4 text-blue-400" /> },
    { id: 'REVIEW', title: "Review/Polish", icon: <Search className="w-4 h-4 text-purple-400" /> },
    { id: 'DONE', title: "Done", icon: <CheckCircle2 className="w-4 h-4 text-green-400" /> },
];

export default function StudioPage() {
    const studioTasks = useDashboardStore((s) => s.studioTasks);
    const moveStudioTask = useDashboardStore((s) => s.moveStudioTask);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);

    // Shadow state for butter-smooth dnd-kit multi-list dragging
    const [localTasks, setLocalTasks] = useState<StudioTask[]>(studioTasks);

    // Sync global to local unless actively dragging
    useEffect(() => {
        if (!activeId) {
            setLocalTasks(studioTasks);
        }
    }, [studioTasks, activeId]);

    // Group tasks by status for rendering
    const tasksByStatus = COLUMNS.reduce((acc, col) => {
        acc[col.id] = localTasks.filter((t) => t.status === col.id);
        return acc;
    }, {} as Record<StudioTaskStatus, StudioTask[]>);

    const activeTask = activeId ? localTasks.find(t => t.id === activeId) : null;

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeIdStr = active.id as string;
        const overIdStr = over.id as string;

        if (activeIdStr === overIdStr) return;

        const isActiveTask = active.data.current?.type === "Task";
        const isOverTask = over.data.current?.type === "Task";

        if (!isActiveTask) return;

        // Dropping a Task over another Task
        if (isActiveTask && isOverTask) {
            setLocalTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeIdStr);
                const overIndex = tasks.findIndex((t) => t.id === overIdStr);

                if (tasks[activeIndex].status !== tasks[overIndex].status) {
                    const newTasks = [...tasks];
                    newTasks[activeIndex] = { ...newTasks[activeIndex], status: tasks[overIndex].status };
                    return arrayMove(newTasks, activeIndex, overIndex);
                }

                return arrayMove(tasks, activeIndex, overIndex);
            });
            return;
        }

        // Dropping a Task over an empty Column
        const isOverAColumn = over.data.current?.type === "Column";
        if (isActiveTask && isOverAColumn) {
            setLocalTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeIdStr);
                const newTasks = [...tasks];
                newTasks[activeIndex] = { ...newTasks[activeIndex], status: overIdStr as StudioTaskStatus };
                return arrayMove(newTasks, activeIndex, activeIndex); // Just trigger re-render
            });
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        const currentActiveId = active.id as string;

        // Find where the task dropped logically via the shadowed array
        const finalTaskState = localTasks.find(t => t.id === currentActiveId);

        // Commit the logical column transfer to Zustand (which handles XP granting)
        // Only if it actually changed column!
        const originalTask = studioTasks.find(t => t.id === currentActiveId);
        if (finalTaskState && originalTask && finalTaskState.status !== originalTask.status) {
            moveStudioTask(finalTaskState.id, finalTaskState.status);
        }

        setActiveId(null);
    };

    return (
        <div className="flex flex-col h-screen -m-6 p-6 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10 shrink-0">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-white mb-2"
                    >
                        Creator Pipeline
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400"
                    >
                        Drag and drop your project tasks. Completing tasks earns XP!
                    </motion.p>
                </div>

                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold shadow-lg shadow-primary/25 transition-all w-fit"
                >
                    <Plus className="w-5 h-5" />
                    Add Task
                </motion.button>
            </div>

            {/* Board Container */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar relative z-10">
                <div className="flex gap-6 h-full items-start px-2 min-w-max">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                    >
                        {COLUMNS.map((col) => (
                            <KanbanColumn
                                key={col.id}
                                id={col.id}
                                title={col.title}
                                icon={col.icon}
                                tasks={tasksByStatus[col.id] || []}
                            />
                        ))}

                        <DragOverlay>
                            {activeTask ? <TaskCard task={activeTask} /> : null}
                        </DragOverlay>
                    </DndContext>
                </div>
            </div>

            {/* Modals */}
            {isAddModalOpen && (
                <AddStudioTaskModal onClose={() => setIsAddModalOpen(false)} />
            )}
        </div>
    );
}
