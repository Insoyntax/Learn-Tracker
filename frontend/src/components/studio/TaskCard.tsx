import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { StudioTask } from "@/store/useDashboardStore";
import { Trash2, GripVertical } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";

interface TaskCardProps {
    task: StudioTask;
}

export const TaskCard = ({ task }: TaskCardProps) => {
    const deleteStudioTask = useDashboardStore((s) => s.deleteStudioTask);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id, data: { type: "Task", task } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-50 ring-2 ring-primary bg-slate-800 border border-slate-700 rounded-xl p-4 min-h-[100px]"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="group relative bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/80 rounded-xl p-4 shadow-sm hover:shadow-xl transition-all cursor-grab active:cursor-grabbing"
        >
            <div className="flex justify-between items-start mb-2 gap-2">
                <div className="flex items-start gap-2">
                    <GripVertical className="w-4 h-4 text-slate-500 mt-1 cursor-grab" />
                    <h3 className="text-slate-200 font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
                        {task.title}
                    </h3>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Delete this task?")) {
                            deleteStudioTask(task.id);
                        }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {task.description && (
                <p className="text-xs text-slate-400 mb-4 line-clamp-2 pl-6">
                    {task.description}
                </p>
            )}

            <div className="mt-3 pl-6">
                <span className="px-2.5 py-1 text-[10px] font-medium tracking-wider uppercase bg-primary/20 text-indigo-300 border border-primary/20 rounded-full">
                    {task.categoryId}
                </span>
            </div>
        </div>
    );
};
