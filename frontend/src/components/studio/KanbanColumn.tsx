import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { StudioTask } from "@/store/useDashboardStore";
import { TaskCard } from "./TaskCard";

interface KanbanColumnProps {
    id: string;
    title: string;
    tasks: StudioTask[];
    icon: React.ReactNode;
}

export const KanbanColumn = ({ id, title, tasks, icon }: KanbanColumnProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id,
        data: { type: "Column", columnId: id }
    });

    return (
        <div className="flex flex-col flex-shrink-0 w-80 bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden h-full max-h-full">
            {/* Header */}
            <div className="p-4 border-b border-slate-700/50 bg-slate-800/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {icon}
                    <h2 className="font-semibold text-slate-200">{title}</h2>
                </div>
                <span className="bg-slate-800 text-slate-400 text-xs font-bold px-2 py-0.5 rounded-full border border-slate-700">
                    {tasks.length}
                </span>
            </div>

            {/* Droppable Area */}
            <div
                ref={setNodeRef}
                className={`flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar transition-colors ${isOver ? 'bg-primary/5' : ''}`}
            >
                <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </SortableContext>

                {tasks.length === 0 && (
                    <div className="h-full min-h-[100px] flex items-center justify-center border-2 border-dashed border-slate-700/50 rounded-xl text-slate-500 text-sm italic">
                        Drop tasks here
                    </div>
                )}
            </div>
        </div>
    );
};
