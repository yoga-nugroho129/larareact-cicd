import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useMobileNavigation } from '../use-mobile-navigation';

describe('useMobileNavigation', () => {
    beforeEach(() => {
        document.body.style.removeProperty('pointer-events');
    });

    it('removes pointer-events style from document.body when cleanup is called', () => {
        document.body.style.setProperty('pointer-events', 'none');
        expect(document.body.style.getPropertyValue('pointer-events')).toBe(
            'none',
        );

        const { result } = renderHook(() => useMobileNavigation());
        const cleanup = result.current;

        cleanup();

        expect(document.body.style.getPropertyValue('pointer-events')).toBe('');
    });

    it('maintains function reference stability across re-renders', () => {
        const { result, rerender } = renderHook(() => useMobileNavigation());
        const firstCleanup = result.current;

        rerender();
        const secondCleanup = result.current;

        expect(firstCleanup).toBe(secondCleanup);
    });
});
