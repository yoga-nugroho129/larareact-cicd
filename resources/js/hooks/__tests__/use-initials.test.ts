import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useInitials } from '../use-initials';

describe('useInitials', () => {
    it('returns an empty string when given an empty name or only spaces', () => {
        const { result } = renderHook(() => useInitials());
        const getInitials = result.current;

        expect(getInitials('')).toBe('');
        expect(getInitials('   ')).toBe('');
    });

    it('returns the first letter uppercased for a single word name', () => {
        const { result } = renderHook(() => useInitials());
        const getInitials = result.current;

        expect(getInitials('John')).toBe('J');
        expect(getInitials('alex')).toBe('A');
    });

    it('returns the first and last initial for a two-word name', () => {
        const { result } = renderHook(() => useInitials());
        const getInitials = result.current;

        expect(getInitials('John Doe')).toBe('JD');
        expect(getInitials('jane doe')).toBe('JD');
    });

    it('returns the first and last initials for multi-word names', () => {
        const { result } = renderHook(() => useInitials());
        const getInitials = result.current;

        expect(getInitials('John Michael Doe')).toBe('JD');
        expect(getInitials('Alexander Graham Bell Senior')).toBe('AS');
    });

    it('handles extra leading, trailing, and multiple consecutive whitespace', () => {
        const { result } = renderHook(() => useInitials());
        const getInitials = result.current;

        expect(getInitials('   Taylor   Swift   ')).toBe('TS');
    });

    it('preserves callback reference across re-renders', () => {
        const { result, rerender } = renderHook(() => useInitials());
        const firstFn = result.current;

        rerender();
        const secondFn = result.current;

        expect(firstFn).toBe(secondFn);
    });
});

