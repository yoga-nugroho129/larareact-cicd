import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useClipboard } from '../use-clipboard';

describe('useClipboard', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('initializes with null copiedText', () => {
        const { result } = renderHook(() => useClipboard());
        const [copiedText] = result.current;

        expect(copiedText).toBeNull();
    });

    it('successfully copies text and updates copiedText state', async () => {
        const writeTextMock = vi.fn().mockResolvedValue(undefined);
        Object.assign(navigator, {
            clipboard: {
                writeText: writeTextMock,
            },
        });

        const { result } = renderHook(() => useClipboard());

        let success = false;
        await act(async () => {
            const [, copy] = result.current;
            success = await copy('Hello World');
        });

        expect(success).toBe(true);
        expect(writeTextMock).toHaveBeenCalledWith('Hello World');
        expect(result.current[0]).toBe('Hello World');
    });

    it('handles clipboard write failure gracefully', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const writeTextMock = vi
            .fn()
            .mockRejectedValue(new Error('Permission denied'));

        Object.assign(navigator, {
            clipboard: {
                writeText: writeTextMock,
            },
        });

        const { result } = renderHook(() => useClipboard());

        let success = true;
        await act(async () => {
            const [, copy] = result.current;
            success = await copy('Failed text');
        });

        expect(success).toBe(false);
        expect(result.current[0]).toBeNull();
        expect(warnSpy).toHaveBeenCalledWith('Copy failed', expect.any(Error));
    });

    it('returns false and warns if navigator.clipboard is not supported', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        // Remove clipboard property
        Object.defineProperty(navigator, 'clipboard', {
            value: undefined,
            configurable: true,
        });

        const { result } = renderHook(() => useClipboard());

        let success = true;
        await act(async () => {
            const [, copy] = result.current;
            success = await copy('Test');
        });

        expect(success).toBe(false);
        expect(result.current[0]).toBeNull();
        expect(warnSpy).toHaveBeenCalledWith('Clipboard not supported');
    });
});
