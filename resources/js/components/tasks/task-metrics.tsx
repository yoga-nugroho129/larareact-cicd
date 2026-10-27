import { CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { TaskCounts } from '@/types';

interface TaskMetricsProps {
    counts: TaskCounts;
}

export function TaskMetrics({ counts }: TaskMetricsProps) {
    const stats = [
        {
            label: 'Total Tasks',
            value: counts.total,
            icon: ListTodo,
            color: 'text-primary',
            bgColor: 'bg-primary/10',
        },
        {
            label: 'To Do',
            value: counts.todo,
            icon: Clock,
            color: 'text-amber-500',
            bgColor: 'bg-amber-500/10',
        },
        {
            label: 'In Progress',
            value: counts.in_progress,
            icon: TrendingUp,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
        },
        {
            label: 'Completed',
            value: counts.done,
            icon: CheckCircle2,
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <Card
                        key={stat.label}
                        className="border-sidebar-border/60 py-3 shadow-none"
                    >
                        <CardContent className="flex items-center justify-between p-4">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    {stat.label}
                                </p>
                                <p className="mt-1 text-2xl font-bold tracking-tight">
                                    {stat.value}
                                </p>
                            </div>
                            <div
                                className={`flex size-10 items-center justify-center rounded-lg ${stat.bgColor}`}
                            >
                                <Icon className={`size-5 ${stat.color}`} />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
