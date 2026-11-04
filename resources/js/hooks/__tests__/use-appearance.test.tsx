import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('use-appearance & initializeTheme', () => {
    let prefersDarkMatches = false;
    let mediaListeners: ((e: unknown) => void)[] = [];

    beforeEach(() => {
        prefersDarkMatches = false;
        mediaListeners = [];
        vi.resetModules();

        window.matchMedia = vi.fn().mockImplementation((query: string) => ({
            matches: prefersDarkMatches,
            media: query,
            addEventListener: vi.fn(
                (event: string, callback: (event: unknown) => void) => {
                    if (event === 'change') {
                        mediaListeners.push(callback);
                    }
                },
            ),
            removeEventListener: vi.fn(
                (event: string, callback: (event: unknown) => void) => {
                    if (event === 'change') {
                        mediaListeners = mediaListeners.filter(
                            (cb) => cb !== callback,
                        );
                    }
                },
            ),
        }));
    });

    describe('initializeTheme', () => {
        it('sets default to system in localStorage and cookies if not present', async () => {
            const { initializeTheme } = await import('../use-appearance');

            initializeTheme();

            expect(localStorage.getItem('appearance')).toBe('system');
            expect(document.cookie).toContain('appearance=system');
        });

        it('reads stored preference from localStorage and applies theme', async () => {
            localStorage.setItem('appearance', 'dark');

            const { initializeTheme } = await import('../use-appearance');
            initializeTheme();

            expect(document.documentElement.classList.contains('dark')).toBe(
                true,
            );
            expect(document.documentElement.style.colorScheme).toBe('dark');
        });

        it('listens to system theme changes when mode is system', async () => {
            const { initializeTheme } = await import('../use-appearance');
            initializeTheme();

            expect(mediaListeners.length).toBeGreaterThan(0);
        });
    });

    describe('useAppearance', () => {
        it('returns system appearance and resolves correctly with prefersDark', async () => {
            prefersDarkMatches = true;
            const { useAppearance, initializeTheme } =
                await import('../use-appearance');
            initializeTheme();

            const { result } = renderHook(() => useAppearance());

            expect(result.current.appearance).toBe('system');
            expect(result.current.resolvedAppearance).toBe('dark');
        });

        it('updates appearance to dark and updates DOM and storage', async () => {
            const { useAppearance, initializeTheme } =
                await import('../use-appearance');
            initializeTheme();

            const { result } = renderHook(() => useAppearance());

            act(() => {
                result.current.updateAppearance('dark');
            });

            expect(result.current.appearance).toBe('dark');
            expect(result.current.resolvedAppearance).toBe('dark');
            expect(localStorage.getItem('appearance')).toBe('dark');
            expect(document.cookie).toContain('appearance=dark');
            expect(document.documentElement.classList.contains('dark')).toBe(
                true,
            );
            expect(document.documentElement.style.colorScheme).toBe('dark');
        });

        it('updates appearance to light and removes dark class', async () => {
            const { useAppearance, initializeTheme } =
                await import('../use-appearance');
            initializeTheme();

            const { result } = renderHook(() => useAppearance());

            act(() => {
                result.current.updateAppearance('light');
            });

            expect(result.current.appearance).toBe('light');
            expect(result.current.resolvedAppearance).toBe('light');
            expect(localStorage.getItem('appearance')).toBe('light');
            expect(document.cookie).toContain('appearance=light');
            expect(document.documentElement.classList.contains('dark')).toBe(
                false,
            );
            expect(document.documentElement.style.colorScheme).toBe('light');
        });

        it('syncs state across multiple hook instances', async () => {
            const { useAppearance, initializeTheme } =
                await import('../use-appearance');
            initializeTheme();

            const { result: hook1 } = renderHook(() => useAppearance());
            const { result: hook2 } = renderHook(() => useAppearance());

            act(() => {
                hook1.current.updateAppearance('dark');
            });

            expect(hook1.current.appearance).toBe('dark');
            expect(hook2.current.appearance).toBe('dark');
        });
    });
});
