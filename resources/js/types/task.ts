export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskAttachment {
    id: number;
    task_id: number;
    file_name: string;
    file_path: string;
    file_size: number;
    mime_type: string | null;
    url: string;
    created_at: string;
    updated_at: string;
}

export interface Task {
    id: number;
    user_id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    due_date: string | null;
    created_at: string;
    updated_at: string;
    attachments: TaskAttachment[];
}

export interface TaskCounts {
    total: number;
    todo: number;
    in_progress: number;
    done: number;
}

export interface TaskFilters {
    status?: string | null;
    priority?: string | null;
    search?: string | null;
}
