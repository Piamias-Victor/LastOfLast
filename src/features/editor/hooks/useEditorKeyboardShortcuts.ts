'use client';

import { useEffect } from 'react';

/**
 * Hook pour gérer les raccourcis clavier de l'éditeur
 */
export function useEditorKeyboardShortcuts(onDeselectAll: () => void): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Échap pour désélectionner tout
      if (e.key === 'Escape') {
        onDeselectAll();
      }
      
      // Autres raccourcis clavier peuvent être ajoutés ici
      // Par exemple:
      // - Ctrl+A pour tout sélectionner
      // - Suppr pour supprimer les éléments sélectionnés
      // - Ctrl+C/Ctrl+V pour copier/coller
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onDeselectAll]);
}