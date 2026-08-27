"use client";

import { useEffect, useRef } from "react";

export function useFocusTrap(isActive: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;
    
    const element = ref.current;
    if (!element) return;

    // Focusable elements selector
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const focusableElements = Array.from(
      element.querySelectorAll<HTMLElement>(focusableSelectors)
    ).filter(el => {
      // Check if element is visible
      return el.offsetWidth > 0 && el.offsetHeight > 0;
    });

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Initial focus
    if (firstElement) {
      // Need a small timeout to let React render the modal fully before focusing
      setTimeout(() => firstElement.focus(), 10);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive]);

  return ref;
}
