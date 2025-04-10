import { useEffect } from 'react';
import { useEditorStore } from '@/store';
import { NotificationType } from './useCanvasNotifications';

interface UseCanvasSetupEffectsProps {
  showToast: (message: string, type: NotificationType) => void;
}

/**
 * Hook pour configurer les effets relatifs au canvas
 */
export function useCanvasSetupEffects({ showToast }: UseCanvasSetupEffectsProps): void {
  const { 
    deselectAll,
    selectedElementIds,
    copySelectedElements,
    pasteElements,
    cutSelectedElements
  } = useEditorStore();

  // Ajouter des raccourcis clavier pour la sélection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Éviter d'intercepter les raccourcis clavier quand un élément d'entrée est actif
      if (
        document.activeElement &&
        (document.activeElement.tagName === 'INPUT' ||
          document.activeElement.tagName === 'TEXTAREA')
      ) {
        return;
      }
      
      // Échap pour désélectionner tout
      if (e.key === 'Escape') {
        deselectAll();
      }
      
      // Copier avec Ctrl+C ou Cmd+C
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedElementIds.length > 0) {
        copySelectedElements();
        showToast(`${selectedElementIds.length} élément(s) copié(s)`, 'success');
        e.preventDefault();
      }
      
      // Coller avec Ctrl+V ou Cmd+V
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        pasteElements();
        showToast('Éléments collés', 'success');
        e.preventDefault();
      }
      
      // Couper avec Ctrl+X ou Cmd+X
      if ((e.ctrlKey || e.metaKey) && e.key === 'x' && selectedElementIds.length > 0) {
        cutSelectedElements();
        showToast(`${selectedElementIds.length} élément(s) coupé(s)`, 'success');
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [deselectAll, selectedElementIds, copySelectedElements, pasteElements, cutSelectedElements, showToast]);

  // Initialisation du canvas - si nécessaire
  useEffect(() => {
    // Code d'initialisation si nécessaire...
  }, []);
}