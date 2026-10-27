import { router } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    CheckCircle,
    Download,
    FileText,
    MoreVertical,
    Pencil,
    RotateCcw,
    Trash2,
    X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Task, TaskPriority, TaskStatus } from '@/types';

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
    const handleStatusChange = (newStatus: TaskStatus) => {
        router.put(
            `/tasks/${task.id}`,
            {
                status: newStatus,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        `Task moved to ${newStatus.replace('_', ' ')}`,
                    );
                },
                onError: () => {
                    toast.error('Failed to update task status');
                },
            },
        );
    };

    const handleDeleteTask = () => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        router.delete(`/tasks/${task.id}`, {
            preserveScroll: true,
            onSuccess: () => toast.success('Task deleted successfully'),
            onError: () => toast.error('Failed to delete task'),
        });
    };

    const handleDeleteAttachment = (attachmentId: number) => {
        if (!confirm('Delete this attachment?')) return;

        router.delete(`/task-attachments/${attachmentId}`, {
            preserveScroll: true,
            onSuccess: () => toast.success('Attachment deleted'),
            onError: () => toast.error('Failed to delete attachment'),
        });
    };

    const getPriorityBadge = (priority: TaskPriority) => {
        switch (priority) {
            case 'high':
                return (
                    <Badge
                        variant="destructive"
                        className="px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase"
                    >
                        High
                    </Badge>
                );
            case 'medium':
                return (
                    <Badge
                        variant="secondary"
                        className="border border-amber-500/20 bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-amber-600 uppercase dark:text-amber-400"
                    >
                        Medium
                    </Badge>
                );
            case 'low':
                return (
                    <Badge
                        variant="outline"
                        className="px-2 py-0.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase"
                    >
                        Low
                    </Badge>
                );
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="group relative rounded-xl border border-sidebar-border/70 bg-card p-4 shadow-sm transition-all hover:border-sidebar-border hover:shadow-md">
            {/* Header: Priority & Actions */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                    {getPriorityBadge(task.priority)}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 opacity-70 group-hover:opacity-100"
                        >
                            <MoreVertical className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem
                            onClick={() => onEdit(task)}
                            className="cursor-pointer gap-2 text-xs"
                        >
                            <Pencil className="size-3.5" />
                            <span>Edit Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleDeleteTask}
                            className="cursor-pointer gap-2 text-xs text-destructive focus:text-destructive"
                        >
                            <Trash2 className="size-3.5" />
                            <span>Delete Task</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Title & Description */}
            <div className="mt-2.5">
                <h4 className="line-clamp-2 text-sm leading-snug font-semibold tracking-tight text-foreground">
                    {task.title}
                </h4>
                {task.description && (
                    <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                        {task.description}
                    </p>
                )}
            </div>

            {/* Attachments Section */}
            {task.attachments && task.attachments.length > 0 && (
                <div className="mt-3 space-y-1.5 border-t border-sidebar-border/40 pt-2.5">
                    <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                        Attachments ({task.attachments.length})
                    </p>
                    <div className="flex flex-col gap-1">
                        {task.attachments.map((att) => (
                            <div
                                key={att.id}
                                className="flex items-center justify-between rounded-md bg-muted/50 px-2 py-1 text-xs"
                            >
                                <a
                                    href={att.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 truncate text-foreground/80 hover:text-primary hover:underline"
                                    title={att.file_name}
                                >
                                    <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                                    <span className="max-w-[150px] truncate">
                                        {att.file_name}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                        ({formatFileSize(att.file_size)})
                                    </span>
                                </a>
                                <div className="ml-1 flex shrink-0 items-center gap-1">
                                    <a
                                        href={att.url}
                                        download={att.file_name}
                                        className="p-0.5 text-muted-foreground hover:text-foreground"
                                        title="Download"
                                    >
                                        <Download className="size-3" />
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteAttachment(att.id)
                                        }
                                        className="p-0.5 text-muted-foreground hover:text-destructive"
                                        title="Delete attachment"
                                    >
                                        <X className="size-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Footer: Due Date & Status Quick Mover */}
            <div className="mt-3.5 flex items-center justify-between border-t border-sidebar-border/40 pt-3 text-xs">
                {task.due_date ? (
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Calendar className="size-3.5" />
                        <span>
                            {new Date(task.due_date).toLocaleDateString(
                                'en-US',
                                { month: 'short', day: 'numeric' },
                            )}
                        </span>
                    </div>
                ) : (
                    <span className="text-[11px] text-muted-foreground/60">
                        No due date
                    </span>
                )}

                {/* Status Transitions */}
                <div className="flex items-center gap-1">
                    {task.status === 'todo' && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1 bg-background px-2 text-xs hover:bg-muted"
                            onClick={() => handleStatusChange('in_progress')}
                        >
                            <span>Start</span>
                            <ArrowRight className="size-3" />
                        </Button>
                    )}

                    {task.status === 'in_progress' && (
                        <>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-1.5 text-xs text-muted-foreground"
                                onClick={() => handleStatusChange('todo')}
                                title="Move back to To Do"
                            >
                                <RotateCcw className="size-3" />
                            </Button>
                            <Button
                                size="sm"
                                variant="default"
                                className="h-7 gap-1 bg-emerald-600 px-2 text-xs text-white hover:bg-emerald-700"
                                onClick={() => handleStatusChange('done')}
                            >
                                <span>Done</span>
                                <CheckCircle className="size-3" />
                            </Button>
                        </>
                    )}

                    {task.status === 'done' && (
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => handleStatusChange('in_progress')}
                            title="Reopen task"
                        >
                            <RotateCcw className="size-3" />
                            <span>Reopen</span>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
