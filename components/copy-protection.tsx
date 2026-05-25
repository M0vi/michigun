'use client';

import { useEffect } from 'react';

export default function CopyProtection() {
  useEffect(() => {
    // 1. Prevent contextmenu globally except on input/textarea
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.closest('input') ||
          target.closest('textarea'))
      ) {
        return;
      }
      e.preventDefault();
    };

    // 2. Prevent dragging images
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'IMG' || target.closest('img'))) {
        e.preventDefault();
      }
    };

    // 3. Prevent text selection (except in input/textarea)
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.closest('input') ||
          target.closest('textarea'))
      ) {
        return;
      }
      e.preventDefault();
    };

    // 4. Prevent copying via shortcut/menu (except in input/textarea)
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.closest('input') ||
          target.closest('textarea'))
      ) {
        return;
      }
      e.preventDefault();
    };

    // 5. Prevent keyboard shortcuts like Ctrl+C, Ctrl+S, Ctrl+Shift+I, F12
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.closest('input') ||
          target.closest('textarea'));

      // If user presses Ctrl+C / Cmd+C outside of input fields, prevent it
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        if (!isInput) {
          e.preventDefault();
        }
      }

      // If user presses Ctrl+S / Cmd+S (Save page), prevent it
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
      }

      // Prevent F12 / Inspect Element shortcuts to deter copying assets
      if (e.key === 'F12') {
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'i') {
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
}
