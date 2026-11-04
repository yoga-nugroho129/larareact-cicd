import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('useIsMobile', () => {
    let changeListeners: ((event: unknown) => void)[] = [];
    let matchesValue = false;

    beforeEach(() => {
        changeListeners = [];
        matchesValue = false;
        vi.resetModules();

        window.matchMedia = vi.fn().mockImplementation((query: string) => ({
            get matches() {
                return matchesValue;
            },
            media: query,
            addEventListener: vi.fn(
                (event: string, callback: (event: unknown) => void) => {
                    if (event === 'change') {
                        changeListeners.push(callback);
                    }
                },
            ),
            removeEventListener: vi.fn(
                (event: string, callback: (event: unknown) => void) => {
                    if (event === 'change') {
                        changeListeners = changeListeners.filter(
                            (cb) => cb !== callback,
                        );
                    }
                },
            ),
        }));
    });

    it('returns false when screen width is larger than mobile breakpoint', async () => {
        matchesValue = false;
        const { useIsMobile } = await import('../use-mobile');

        const { result } = renderHook(() => useIsMobile());

        expect(result.current).toBe(false);
    });

    it('returns true when screen width matches mobile query', async () => {
        matchesValue = true;
        const { useIsMobile } = await import('../use-mobile');

        const { result } = renderHook(() => useIsMobile());

        expect(result.current).toBe(true);
    });

    it('updates state dynamically when media query change event triggers', async () => {
        matchesValue = false;
        const { useIsMobile } = await import('../use-mobile');

        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(false);

        // Simulate viewport resize to mobile
        act(() => {
            matchesValue = true;
            changeListeners.forEach((listener) =>
                listener({ matches: true } as MediaQueryListEvent),
            );
        });

        expect(result.current).toBe(true);

        // Simulate viewport resize back to desktop
        act(() => {
            matchesValue = false;
            changeListeners.forEach((listener) =>
                listener({ matches: false } as MediaQueryListEvent),
            );
        });

        expect(result.current).toBe(false);
    });

    it('cleans up event listener on unmount', async () => {
        const { useIsMobile } = await import('../use-mobile');

        const { unmount } = renderHook(() => useIsMobile());
        expect(changeListeners.length).toBeGreaterThan(0);

        unmount();
        expect(changeListeners.length).toBe(0);
    });
});

