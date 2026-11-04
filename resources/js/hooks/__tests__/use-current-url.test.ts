import { usePage } from '@inertiajs/react';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCurrentUrl } from '../use-current-url';

vi.mock('@inertiajs/react', () => ({
    usePage: vi.fn(),
}));

describe('useCurrentUrl', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(usePage).mockReturnValue({
            url: '/dashboard',
        } as ReturnType<typeof usePage>);
    });

    it('extracts the pathname from page.url as currentUrl', () => {
        vi.mocked(usePage).mockReturnValue({
            url: '/tasks?status=completed&page=2',
        } as ReturnType<typeof usePage>);

        const { result } = renderHook(() => useCurrentUrl());

        expect(result.current.currentUrl).toBe('/tasks');
    });

    describe('isCurrentUrl', () => {
        it('returns true when relative URL matches current path', () => {
            const { result } = renderHook(() => useCurrentUrl());

            expect(result.current.isCurrentUrl('/dashboard')).toBe(true);
            expect(result.current.isCurrentUrl('/settings')).toBe(false);
        });

        it('supports Inertia link object with url property', () => {
            const { result } = renderHook(() => useCurrentUrl());

            expect(
                result.current.isCurrentUrl({ url: '/dashboard' } as never),
            ).toBe(true);
            expect(
                result.current.isCurrentUrl({ url: '/settings' } as never),
            ).toBe(false);
        });

        it('supports matching with absolute URLs', () => {
            const { result } = renderHook(() => useCurrentUrl());

            expect(
                result.current.isCurrentUrl('http://localhost/dashboard'),
            ).toBe(true);
            expect(
                result.current.isCurrentUrl('https://example.com/settings'),
            ).toBe(false);
        });

        it('allows comparing against a custom currentUrl override', () => {
            const { result } = renderHook(() => useCurrentUrl());

            expect(result.current.isCurrentUrl('/profile', '/profile')).toBe(
                true,
            );
            expect(result.current.isCurrentUrl('/dashboard', '/profile')).toBe(
                false,
            );
        });

        it('supports prefix matching when startsWith is true', () => {
            const { result } = renderHook(() => useCurrentUrl());

            expect(
                result.current.isCurrentUrl('/tasks', '/tasks/123/edit', true),
            ).toBe(true);
            expect(
                result.current.isCurrentUrl('/tasks', '/projects/123', true),
            ).toBe(false);
        });
    });

    describe('isCurrentOrParentUrl', () => {
        it('returns true for parent paths using startsWith matching', () => {
            vi.mocked(usePage).mockReturnValue({
                url: '/settings/security',
            } as ReturnType<typeof usePage>);

            const { result } = renderHook(() => useCurrentUrl());

            expect(result.current.isCurrentOrParentUrl('/settings')).toBe(true);
            expect(result.current.isCurrentOrParentUrl('/dashboard')).toBe(
                false,
            );
        });
    });

    describe('whenCurrentUrl', () => {
        it('returns ifTrue when URL matches and ifFalse (or null) when it does not', () => {
            const { result } = renderHook(() => useCurrentUrl());

            expect(
                result.current.whenCurrentUrl(
                    '/dashboard',
                    'active-class',
                    'inactive-class',
                ),
            ).toBe('active-class');

            expect(
                result.current.whenCurrentUrl(
                    '/settings',
                    'active-class',
                    'inactive-class',
                ),
            ).toBe('inactive-class');

            expect(
                result.current.whenCurrentUrl('/settings', 'active-class'),
            ).toBeNull();
        });
    });
});
