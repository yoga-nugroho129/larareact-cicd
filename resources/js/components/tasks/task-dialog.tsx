import { router, useForm } from '@inertiajs/react';
import {
    Download,
    FileText,
    Loader2,
    Paperclip,
    UploadCloud,
    X,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Task, TaskPriority, TaskStatus } from '@/types';

interface TaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    taskToEdit?: Task | null;
    defaultStatus?: TaskStatus;
}

export function TaskDialog({
    open,
    onOpenChange,
    taskToEdit,
    defaultStatus = 'todo',
}: TaskDialogProps) {
    const isEditing = Boolean(taskToEdit);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors,
        transform,
    } = useForm<{
        title: string;
        description: string;
        status: TaskStatus;
        priority: TaskPriority;
        due_date: string;
        attachment: File | null;
        _method?: string;
    }>({
        title: '',
        description: '',
        status: defaultStatus,
        priority: 'medium',
        due_date: '',
        attachment: null,
    });

    useEffect(() => {
        if (!open) {
            return;
        }

        if (taskToEdit) {
            setData({
                title: taskToEdit.title,
                description: taskToEdit.description || '',
                status: taskToEdit.status,
                priority: taskToEdit.priority,
                due_date: taskToEdit.due_date
                    ? taskToEdit.due_date.substring(0, 10)
                    : '',
                attachment: null,
            });
        } else {
            setData({
                title: '',
                description: '',
                status: defaultStatus,
                priority: 'medium',
                due_date: '',
                attachment: null,
            });
        }
        clearErrors();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [taskToEdit, open, defaultStatus]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && taskToEdit) {
            transform((formData) => ({
                ...formData,
                _method: 'PUT',
            }));

            post(`/tasks/${taskToEdit.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Task updated successfully');
                    onOpenChange(false);
                },
                onError: () => {
                    toast.error('Please resolve the errors below');
                },
            });
        } else {
            transform((formData) => {
                const { _method, ...rest } = formData;
                return rest;
            });

            post('/tasks', {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Task created successfully');
                    reset();
                    onOpenChange(false);
                },
                onError: () => {
                    toast.error('Please resolve the errors below');
                },
            });
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const handleDeleteExistingAttachment = (attachmentId: number) => {
        if (!confirm('Are you sure you want to delete this attachment?'))
            return;

        router.delete(`/task-attachments/${attachmentId}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Attachment deleted');
            },
            onError: () => {
                toast.error('Failed to delete attachment');
            },
        });
    };

    const handleClearSelectedFile = () => {
        setData('attachment', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit Task' : 'Create New Task'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Update task details, status, or attach additional files.'
                            : 'Add a new task to your CI/CD delivery pipeline and board.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {/* Title */}
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="task-title"
                            className="text-xs font-semibold"
                        >
                            Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="task-title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="e.g. Build multi-stage Docker image"
                            disabled={processing}
                            required
                        />
                        {errors.title && (
                            <p className="text-xs text-destructive">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="task-description"
                            className="text-xs font-semibold"
                        >
                            Description
                        </Label>
                        <textarea
                            id="task-description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            rows={3}
                            placeholder="Provide specifications, acceptance criteria, or relevant links..."
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={processing}
                        />
                        {errors.description && (
                            <p className="text-xs text-destructive">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Status & Priority Row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="task-status"
                                className="text-xs font-semibold"
                            >
                                Status
                            </Label>
                            <Select
                                value={data.status}
                                onValueChange={(val: TaskStatus) =>
                                    setData('status', val)
                                }
                                disabled={processing}
                            >
                                <SelectTrigger id="task-status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todo">To Do</SelectItem>
                                    <SelectItem value="in_progress">
                                        In Progress
                                    </SelectItem>
                                    <SelectItem value="done">
                                        Completed
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-xs text-destructive">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label
                                htmlFor="task-priority"
                                className="text-xs font-semibold"
                            >
                                Priority
                            </Label>
                            <Select
                                value={data.priority}
                                onValueChange={(val: TaskPriority) =>
                                    setData('priority', val)
                                }
                                disabled={processing}
                            >
                                <SelectTrigger id="task-priority">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">
                                        Medium
                                    </SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.priority && (
                                <p className="text-xs text-destructive">
                                    {errors.priority}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Due Date & Attachment */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="task-due-date"
                                className="text-xs font-semibold"
                            >
                                Due Date
                            </Label>
                            <Input
                                id="task-due-date"
                                type="date"
                                value={data.due_date}
                                onChange={(e) =>
                                    setData('due_date', e.target.value)
                                }
                                disabled={processing}
                            />
                            {errors.due_date && (
                                <p className="text-xs text-destructive">
                                    {errors.due_date}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label
                                htmlFor="task-attachment"
                                className="text-xs font-semibold"
                            >
                                {isEditing
                                    ? 'Upload Additional Attachment'
                                    : 'Attachment (File or Image)'}
                            </Label>
                            <div className="relative">
                                <input
                                    ref={fileInputRef}
                                    id="task-attachment"
                                    type="file"
                                    onChange={(e) => {
                                        if (
                                            e.target.files &&
                                            e.target.files[0]
                                        ) {
                                            setData(
                                                'attachment',
                                                e.target.files[0],
                                            );
                                        }
                                    }}
                                    className="hidden"
                                    disabled={processing}
                                />
                                {data.attachment ? (
                                    <div className="flex items-center justify-between rounded-md border border-input bg-background px-3 py-1.5 text-xs">
                                        <div className="flex items-center gap-1.5 truncate">
                                            <Paperclip className="size-3.5 shrink-0 text-primary" />
                                            <span className="truncate font-medium">
                                                {data.attachment.name}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">
                                                (
                                                {formatFileSize(
                                                    data.attachment.size,
                                                )}
                                                )
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleClearSelectedFile}
                                            className="p-0.5 text-muted-foreground hover:text-destructive"
                                            title="Clear selection"
                                        >
                                            <X className="size-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full justify-start truncate text-xs font-normal"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        disabled={processing}
                                    >
                                        <UploadCloud className="mr-1.5 size-3.5 shrink-0 text-muted-foreground" />
                                        <span className="text-muted-foreground">
                                            {isEditing
                                                ? 'Choose file to add to this task...'
                                                : 'Select file (PDF, PNG, etc.)'}
                                        </span>
                                    </Button>
                                )}
                            </div>
                            {errors.attachment && (
                                <p className="text-xs text-destructive">
                                    {errors.attachment}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Existing Attachments Display in Edit Mode */}
                    {isEditing &&
                        taskToEdit?.attachments &&
                        taskToEdit.attachments.length > 0 && (
                            <div className="space-y-1.5 rounded-lg border border-sidebar-border/70 bg-muted/40 p-3">
                                <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    Current Attachments (
                                    {taskToEdit.attachments.length})
                                </Label>
                                <div className="mt-1 flex flex-col gap-1.5">
                                    {taskToEdit.attachments.map((att) => (
                                        <div
                                            key={att.id}
                                            className="flex items-center justify-between rounded-md border border-sidebar-border/60 bg-background px-2.5 py-1.5 text-xs shadow-2xs"
                                        >
                                            <a
                                                href={att.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-2 truncate text-foreground hover:text-primary hover:underline"
                                                title={att.file_name}
                                            >
                                                <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                                                <span className="max-w-[200px] truncate font-medium">
                                                    {att.file_name}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    (
                                                    {formatFileSize(
                                                        att.file_size,
                                                    )}
                                                    )
                                                </span>
                                            </a>

                                            <div className="flex shrink-0 items-center gap-1.5">
                                                <a
                                                    href={att.url}
                                                    download={att.file_name}
                                                    className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    title="Download"
                                                >
                                                    <Download className="size-3.5" />
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteExistingAttachment(
                                                            att.id,
                                                        )
                                                    }
                                                    className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                                                    title="Delete attachment"
                                                >
                                                    <X className="size-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    <DialogFooter className="pt-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="gap-1.5"
                        >
                            {processing && (
                                <Loader2 className="size-4 animate-spin" />
                            )}
                            <span>
                                {isEditing ? 'Save Changes' : 'Create Task'}
                            </span>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
