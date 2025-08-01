'use client';

import { useEffect, useCallback } from 'react';

export interface KeyboardShortcuts {
  onAnalyze?: () => void;
  onToggleTheme?: () => void;
  onFocusTicker?: () => void;
  onToggleSettings?: () => void;
  onCloseSheet?: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when user is typing in an input/textarea
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement ||
      (event.target as HTMLElement)?.contentEditable === 'true'
    ) {
      return;
    }

    const { ctrlKey, metaKey, altKey, shiftKey, key } = event;
    const cmdKey = ctrlKey || metaKey; // Cmd on Mac, Ctrl on Windows/Linux

    // Prevent default behavior for our shortcuts
    const shouldPreventDefault = () => {
      event.preventDefault();
      event.stopPropagation();
    };

    switch (true) {
      // Cmd/Ctrl + Enter: Analyze patterns
      case cmdKey && key === 'Enter':
        shouldPreventDefault();
        shortcuts.onAnalyze?.();
        break;

      // Cmd/Ctrl + D: Toggle theme
      case cmdKey && key === 'd':
        shouldPreventDefault();
        shortcuts.onToggleTheme?.();
        break;

      // Cmd/Ctrl + K: Focus ticker input
      case cmdKey && key === 'k':
        shouldPreventDefault();
        shortcuts.onFocusTicker?.();
        break;

      // Cmd/Ctrl + ,: Toggle chart settings
      case cmdKey && key === ',':
        shouldPreventDefault();
        shortcuts.onToggleSettings?.();
        break;

      // Escape: Close analysis sheet
      case key === 'Escape':
        shouldPreventDefault();
        shortcuts.onCloseSheet?.();
        break;

      // Alt + A: Analyze patterns (alternative)
      case altKey && key === 'a':
        shouldPreventDefault();
        shortcuts.onAnalyze?.();
        break;

      // Alt + T: Toggle theme (alternative)
      case altKey && key === 't':
        shouldPreventDefault();
        shortcuts.onToggleTheme?.();
        break;

      default:
        // No matching shortcut, don't prevent default
        break;
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Return the shortcuts help text for display
  return {
    shortcuts: [
      { key: 'Cmd/Ctrl + Enter', description: 'Analyze patterns' },
      { key: 'Cmd/Ctrl + D', description: 'Toggle theme' },
      { key: 'Cmd/Ctrl + K', description: 'Focus ticker input' },
      { key: 'Cmd/Ctrl + ,', description: 'Open chart settings' },
      { key: 'Escape', description: 'Close analysis sheet' },
      { key: 'Alt + A', description: 'Analyze patterns' },
      { key: 'Alt + T', description: 'Toggle theme' },
    ],
  };
}