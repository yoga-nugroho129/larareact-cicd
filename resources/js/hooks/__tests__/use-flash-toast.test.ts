import { renderHook } from '@testing-library/react';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useFlashToast } from '../use-flash-toast';

const mockRouterOn = vi.fn();

vi.mock('@inertiajs/react', () => ({
    router: {
        on: (...args: unknown[]) => mockRouterOn(...args),
    },
}));

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    },
}));

describe('useFlashToast', () => {
    let unregisterMock: ReturnType<typeof vi.fn>;
    let flashCallback: ((event: unknown) => void) | null = null;

    beforeEach(() => {
        vi.clearAllMocks();
        unregisterMock = vi.fn();
        flashCallback = null;

        mockRouterOn.mockImplementation(
            (_event: unknown, callback: (event: unknown) => void) => {
                flashCallback = callback;

                return unregisterMock;
            },
        );
    });

    it('subscribes to router flash event on mount and unregisters on unmount', () => {
        const { unmount } = renderHook(() => useFlashToast());

        expect(mockRouterOn).toHaveBeenCalledWith(
            'flash',
            expect.any(Function),
        );

        unmount();
        expect(unregisterMock).toHaveBeenCalledTimes(1);
    });

    it('triggers toast with correct message and type when flash toast event fires', () => {
        renderHook(() => useFlashToast());

        expect(flashCallback).not.toBeNull();

        // Simulate success toast flash event
        flashCallback!({
            detail: {
                flash: {
                    toast: {
                        type: 'success',
                        message: 'Task successfully created!',
                    },
                },
            },
        });

        expect(toast.success).toHaveBeenCalledWith(
            'Task successfully created!',
        );

        // Simulate error toast flash event
        flashCallback!({
            detail: {
                flash: {
                    toast: {
                        type: 'error',
                        message: 'An unexpected error occurred.',
                    },
                },
            },
        });

        expect(toast.error).toHaveBeenCalledWith(
            'An unexpected error occurred.',
        );
    });

    it('ignores flash events that do not contain toast payload', () => {
        renderHook(() => useFlashToast());

        flashCallback!({
            detail: {
                flash: {},
            },
        });

        flashCallback!({
            detail: {},
        });

        expect(toast.success).not.toHaveBeenCalled();
        expect(toast.error).not.toHaveBeenCalled();
    });
});
