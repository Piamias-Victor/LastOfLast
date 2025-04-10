import { useCallback } from 'react';
import { useEditorStore } from '@/store';
import { useAlignment } from '@/features/alignment';
import { HorizontalAlignment, VerticalAlignment } from '@/features/alignment';
import { NotificationType } from './useCanvasNotifications';

interface UseCanvasActionHandlersProps {
  showToast: (message: string, type: NotificationType) => void;
}

interface UseCanvasActionHandlersResult {
  handleCopy: () => void;
  handlePaste: () => void;
  handleCut: () => void;
  handleDelete: () => void;
  handleAlignHorizontally: (alignment: HorizontalAlignment) => void;
  handleAlignVertically: (alignment: VerticalAlignment) => void;
  handleDistributeHorizontally: () => void;
  handleDistributeVertically: () => void;
}

/**
 * Hook pour gérer les actions utilisateur sur le canvas
 */
export function useCanvasActionHandlers({ 
  showToast 
}: UseCanvasActionHandlersProps): UseCanvasActionHandlersResult {
  const { 
    selectedElementIds,
    copySelectedElements,
    pasteElements,
    cutSelectedElements,
    removeSelectedElements
  } = useEditorStore();
  
  const {
    alignHorizontally,
    alignVertically,
    distributeElementsHorizontally,
    distributeElementsVertically
  } = useAlignment();

  const handleCopy = useCallback(() => {
    copySelectedElements();
    showToast(`${selectedElementIds.length} élément(s) copié(s)`, 'success');
  }, [copySelectedElements, selectedElementIds, showToast]);
  
  const handlePaste = useCallback(() => {
    pasteElements();
    showToast('Éléments collés', 'success');
  }, [pasteElements, showToast]);
  
  const handleCut = useCallback(() => {
    cutSelectedElements();
    showToast(`${selectedElementIds.length} élément(s) coupé(s)`, 'success');
  }, [cutSelectedElements, selectedElementIds, showToast]);
  
  const handleDelete = useCallback(() => {
    const count = selectedElementIds.length;
    removeSelectedElements();
    showToast(`${count} élément(s) supprimé(s)`, 'info');
  }, [removeSelectedElements, selectedElementIds, showToast]);
  
  const handleAlignHorizontally = useCallback((alignment: HorizontalAlignment) => {
    alignHorizontally(alignment);
    showToast(`Alignement horizontal appliqué`, 'success');
  }, [alignHorizontally, showToast]);
  
  const handleAlignVertically = useCallback((alignment: VerticalAlignment) => {
    alignVertically(alignment);
    showToast(`Alignement vertical appliqué`, 'success');
  }, [alignVertically, showToast]);
  
  const handleDistributeHorizontally = useCallback(() => {
    distributeElementsHorizontally();
    showToast(`Distribution horizontale appliquée`, 'success');
  }, [distributeElementsHorizontally, showToast]);
  
  const handleDistributeVertically = useCallback(() => {
    distributeElementsVertically();
    showToast(`Distribution verticale appliquée`, 'success');
  }, [distributeElementsVertically, showToast]);

  return {
    handleCopy,
    handlePaste,
    handleCut,
    handleDelete,
    handleAlignHorizontally,
    handleAlignVertically,
    handleDistributeHorizontally,
    handleDistributeVertically
  };
}