import { router } from '@inertiajs/react';
import { Filter, Plus, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { TaskFilters } from '@/types';

interface TaskFilterBarProps {
    filters: TaskFilters;
    onOpenCreate: () => void;
}

export function TaskFilterBar({ filters, onOpenCreate }: TaskFilterBarProps) {
    const [search, setSearch] = useState(filters.search || '');

    const applyFilter = (key: 'search' | 'priority', value: string | null) => {
        const query: Record<string, string> = {};

        const nextSearch = key === 'search' ? value : search;
        const nextPriority = key === 'priority' ? value : filters.priority;

        if (nextSearch && nextSearch.trim() !== '') {
            query.search = nextSearch.trim();
        }

        if (nextPriority && nextPriority !== 'all') {
            query.priority = nextPriority;
        }

        if (filters.status) {
            query.status = filters.status;
        }

        router.get('/tasks', query, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter('search', search);
    };

    const handleClearSearch = () => {
        setSearch('');
        applyFilter('search', null);
    };

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <form
                onSubmit={handleSearchSubmit}
                className="relative flex max-w-md flex-1 items-center"
            >
                <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
                <Input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search tasks by title or details..."
                    className="pr-8 pl-9"
                />
                {search && (
                    <button
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute right-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <X className="size-4" />
                    </button>
                )}
            </form>

            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Filter className="size-3.5" />
                    <span className="hidden sm:inline">Priority:</span>
                </div>
                <Select
                    value={filters.priority || 'all'}
                    onValueChange={(val) =>
                        applyFilter('priority', val === 'all' ? null : val)
                    }
                >
                    <SelectTrigger className="h-9 w-[125px]">
                        <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    onClick={onOpenCreate}
                    className="h-9 gap-1.5 shadow-sm"
                >
                    <Plus className="size-4" />
                    <span>New Task</span>
                </Button>
            </div>
        </div>
    );
}
