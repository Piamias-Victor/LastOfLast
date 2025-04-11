import { useEffect, useCallback } from 'react';

interface UseCanvasKeyboardNavigationProps {
  handlePanKeyboard: (direction: 'up' | 'down' | 'left' | 'right', shiftKey: boolean) => void;
  isActive?: boolean;
}

/**
 * Hook pour gérer les raccourcis clavier de navigation du canvas
 */
export function useCanvasKeyboardNavigation({
  handlePanKeyboard,
  isActive = true
}: UseCanvasKeyboardNavigationProps): void {
  // Définir la fonction de gestion des touches comme un callback pour éviter les recréations inutiles
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignorer si le hook n'est pas actif
    if (!isActive) return;
    
    // Ignorer si une entrée texte est active
    if (
      document.activeElement &&
      (document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA')
    ) {
      return;
    }

    // Navigation avec les flèches
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        handlePanKeyboard('up', e.shiftKey);
        break;
      case 'ArrowDown':
        e.preventDefault();
        handlePanKeyboard('down', e.shiftKey);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        handlePanKeyboard('left', e.shiftKey);
        break;
      case 'ArrowRight':
        e.preventDefault();
        handlePanKeyboard('right', e.shiftKey);
        break;
    }
  }, [handlePanKeyboard, isActive]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}