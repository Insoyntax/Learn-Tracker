"use client";

import { useState } from "react";
import { MatteCard } from "@/components/ui/MatteCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Search, Plus, MoreHorizontal, MessageSquare, Paperclip } from "lucide-react";
import { useDashboardStore, StudioTask, StudioTaskStatus } from "@/store/useDashboardStore";
import { 
    DndContext, 
    DragOverlay, 
    closestCorners, 
    KeyboardSensor, 
    PointerSensor, 
    useSensor, 
    useSensors,
    DragStartEvent,
    DragEndEvent,
    useDroppable
} from '@dnd-kit/core';
import { 
    SortableContext, 
    sortableKeyboardCoordinates, 
    useSortable, 
    verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function StudioPage() {
    const studioTasks = useDashboardStore(s => s.studioTasks || []);
    const moveStudioTask = useDashboardStore(s => s.moveStudioTask);
    const [activeTask, setActiveTask] = useState<StudioTask | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        if (active.data.current?.type === 'Task') {
            setActiveTask(active.data.current.task);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveTask(null);
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        
        const activeTask = studioTasks.find(t => t.id === activeId);
        if (!activeTask) return;

        let newStatus = activeTask.status;

        const isOverColumn = over.data.current?.type === 'Column';
        if (isOverColumn) {
            newStatus = over.data.current?.status;
        } else if (over.data.current?.type === 'Task') {
            newStatus = over.data.current?.task.status;
        }

        if (activeTask.status !== newStatus) {
            moveStudioTask(activeId, newStatus as StudioTaskStatus);
        }
    };

    const COLUMNS = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'] as const;

    return (
        <DndContext 
            sensors={sensors} 
            collisionDetection={closestCorners} 
            onDragStart={handleDragStart} 
            onDragEnd={handleDragEnd}
        >
            <div className="h-full flex flex-col space-y-6 max-w-[1600px] mx-auto overflow-hidden">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Homework Studio</h1>
                        <p className="text-zinc-400 mt-1">Manage your tasks and assignments.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-400" />
                            <input 
                                type="text"
                                placeholder="Filter tasks..."
                                className="w-full sm:w-64 bg-[#1C1C1E] border border-white/5 rounded-lg py-2 pl-9 pr-4 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500/50"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-medium rounded-lg transition-colors text-sm">
                            <Plus className="w-4 h-4" />
                            New Task
                        </button>
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar pb-4">
                    <div className="flex gap-6 h-full min-w-[1000px]">
                        {COLUMNS.map(col => (
                            <Column key={col} status={col} tasks={studioTasks.filter(t => t.status === col)} />
                        ))}
                    </div>
                </div>
            </div>

            <DragOverlay>
                {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
            </DragOverlay>
        </DndContext>
    );
}

function Column({ status, tasks }: { status: string, tasks: StudioTask[] }) {
    const { setNodeRef } = useDroppable({
        id: status,
        data: {
            type: 'Column',
            status,
        },
    });

    const statusConfig: any = {
        TODO: { label: 'To Do', color: 'bg-zinc-500', textColor: 'text-zinc-300' },
        IN_PROGRESS: { label: 'In Progress', color: 'bg-cyan-400', textColor: 'text-cyan-400' },
        REVIEW: { label: 'Under Review', color: 'bg-amber-400', textColor: 'text-amber-400' },
        DONE: { label: 'Completed', color: 'bg-emerald-400', textColor: 'text-emerald-400' }
    }[status];

    return (
        <div className="flex-1 flex flex-col min-w-[280px]">
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className={`text-sm font-semibold ${statusConfig.textColor} flex items-center gap-2`}>
                    <span className={`w-2 h-2 rounded-full ${statusConfig.color}`} />
                    {statusConfig.label}
                </h3>
                <span className="text-xs text-zinc-500 font-medium bg-white/5 px-2 py-0.5 rounded-full">
                    {tasks.length}
                </span>
            </div>
            
            <div ref={setNodeRef} className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2 min-h-[150px]">
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.length === 0 ? (
                        <MatteCard className="p-6 flex flex-col items-center justify-center text-center opacity-50 border-dashed">
                            <p className="text-sm text-zinc-400 font-medium">No tasks yet.</p>
                            {status === 'TODO' && <p className="text-xs text-zinc-500 mt-1">Create your first mission.</p>}
                        </MatteCard>
                    ) : (
                        tasks.map(task => (
                            <SortableTaskCard key={task.id} task={task} />
                        ))
                    )}
                </SortableContext>
            </div>
        </div>
    );
}

function SortableTaskCard({ task }: { task: StudioTask }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id, data: { type: 'Task', task } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <TaskCard task={task} />
        </div>
    );
}

function TaskCard({ task, isOverlay = false }: { task: StudioTask, isOverlay?: boolean }) {
    const active = task.status === 'IN_PROGRESS';
    const completed = task.status === 'DONE';
    const color = completed ? 'zinc' : 'cyan';

    return (
        <MatteCard className={`p-4 ${isOverlay ? 'cursor-grabbing scale-105 shadow-2xl shadow-cyan-500/20 z-50' : 'cursor-grab group transition-all hover:-translate-y-1'} ${active ? 'border-cyan-500/50 shadow-cyan-900/20' : ''} ${completed ? 'opacity-50' : ''}`}>
            <div className="flex items-start justify-between mb-3">
                <StatusBadge color={color as any}>Normal</StatusBadge>
                <button className="text-zinc-500 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>
            <h4 className={`text-sm font-medium mb-1 ${completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                {task.title}
            </h4>
            <p className="text-xs text-zinc-500 mb-4">{task.categoryId || "General"}</p>
            
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-zinc-500">
                        <MessageSquare className="w-3 h-3" />
                        <span className="text-[10px]">0</span>
                    </div>
                    <div className="flex items-center gap-1 text-zinc-500">
                        <Paperclip className="w-3 h-3" />
                        <span className="text-[10px]">0</span>
                    </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] font-medium uppercase">
                    US
                </div>
            </div>
        </MatteCard>
    );
}
