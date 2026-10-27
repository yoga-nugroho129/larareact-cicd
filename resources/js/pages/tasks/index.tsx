import { Head } from '@inertiajs/react';
import { CheckCircle2, Clock, Plus, Sparkles, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { TaskCard } from '@/components/tasks/task-card';
import { TaskDialog } from '@/components/tasks/task-dialog';
import { TaskFilterBar } from '@/components/tasks/task-filter-bar';
import { TaskMetrics } from '@/components/tasks/task-metrics';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type {
    BreadcrumbItem,
    Task,
    TaskCounts,
    TaskFilters,
    TaskStatus,
} from '@/types';

interface TaskIndexProps {
    tasks: Task[];
    filters: TaskFilters;
    counts: TaskCounts;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Task Board',
        href: '/tasks',
    },
];

export default function TaskIndex({ tasks, filters, counts }: TaskIndexProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [createStatus, setCreateStatus] = useState<TaskStatus>('todo');

    // Group tasks by column status
    const columns = useMemo(() => {
        return {
            todo: tasks.filter((t) => t.status === 'todo'),
            in_progress: tasks.filter((t) => t.status === 'in_progress'),
            done: tasks.filter((t) => t.status === 'done'),
        };
    }, [tasks]);

    const handleOpenCreate = (defaultStatus: TaskStatus = 'todo') => {
        setCreateStatus(defaultStatus);
        setTaskToEdit(null);
        setDialogOpen(true);
    };

    const handleEditTask = (task: Task) => {
        setTaskToEdit(task);
        setDialogOpen(true);
    };

    const handleCloseDialog = (open: boolean) => {
        setDialogOpen(open);
        if (!open) {
            setTaskToEdit(null);
        }
    };

    const columnConfigs: Array<{
        status: TaskStatus;
        title: string;
        icon: typeof Clock;
        accentColor: string;
        badgeColor: string;
    }> = [
        {
            status: 'todo',
            title: 'To Do',
            icon: Clock,
            accentColor: 'border-t-amber-500',
            badgeColor:
                'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        },
        {
            status: 'in_progress',
            title: 'In Progress',
            icon: TrendingUp,
            accentColor: 'border-t-blue-500',
            badgeColor:
                'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        },
        {
            status: 'done',
            title: 'Completed',
            icon: CheckCircle2,
            accentColor: 'border-t-emerald-500',
            badgeColor:
                'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        },
    ];

    return (
        <>
            <Head title="Task Board" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">
                                Task Board
                            </h1>
                            <Badge
                                variant="outline"
                                className="hidden gap-1 text-[11px] font-normal sm:inline-flex"
                            >
                                <Sparkles className="size-3 text-primary" />
                                <span>CI/CD Pipeline Tracker</span>
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Organize, track progress, and deploy CI/CD tasks
                            efficiently across your team.
                        </p>
                    </div>
                </div>

                {/* Metrics Cards */}
                <TaskMetrics counts={counts} />

                {/* Search & Filter Bar */}
                <TaskFilterBar
                    filters={filters}
                    onOpenCreate={() => handleOpenCreate('todo')}
                />

                {/* Kanban Columns Grid */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {columnConfigs.map((col) => {
                        const Icon = col.icon;
                        const columnTasks = columns[col.status];

                        return (
                            <div
                                key={col.status}
                                className={`flex flex-col rounded-xl border border-t-4 border-sidebar-border/70 ${col.accentColor} bg-muted/20 p-3.5`}
                            >
                                {/* Column Header */}
                                <div className="flex items-center justify-between pb-3">
                                    <div className="flex items-center gap-2">
                                        <Icon className="size-4 text-muted-foreground" />
                                        <h3 className="text-sm font-semibold">
                                            {col.title}
                                        </h3>
                                        <span
                                            className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${col.badgeColor}`}
                                        >
                                            {columnTasks.length}
                                        </span>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-7 text-muted-foreground hover:text-foreground"
                                        onClick={() =>
                                            handleOpenCreate(col.status)
                                        }
                                        title={`Add task to ${col.title}`}
                                    >
                                        <Plus className="size-4" />
                                    </Button>
                                </div>

                                {/* Task Cards List */}
                                <div className="flex min-h-[300px] flex-1 flex-col gap-3">
                                    {columnTasks.length > 0 ? (
                                        columnTasks.map((task) => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                                onEdit={handleEditTask}
                                            />
                                        ))
                                    ) : (
                                        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-sidebar-border/60 p-6 text-center">
                                            <p className="text-xs font-medium text-muted-foreground">
                                                No tasks in{' '}
                                                {col.title.toLowerCase()}
                                            </p>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="mt-1 text-xs text-primary"
                                                onClick={() =>
                                                    handleOpenCreate(col.status)
                                                }
                                            >
                                                + Add task
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Create / Edit Dialog */}
            <TaskDialog
                key={
                    taskToEdit
                        ? `edit-${taskToEdit.id}`
                        : `create-${createStatus}-${dialogOpen}`
                }
                open={dialogOpen}
                onOpenChange={handleCloseDialog}
                taskToEdit={taskToEdit}
                defaultStatus={createStatus}
            />
        </>
    );
}

TaskIndex.layout = {
    breadcrumbs,
};
