import { useCallback } from 'react';
import { Vector2D } from '@/types/geometry';
import { SelectionBox } from '../types';
import { useEditorStore } from '@/store';
import { ElementDetectionResult } from '../types';

interface UseMultiSelectionProps {
  elementDetection: ElementDetectionResult;
  selectionBox: SelectionBox;
  setSelectionBox: (selectionBox: SelectionBox) => void;
}

interface UseMultiSelectionResult {
  updateSelectionBox: (endPoint: Vector2D) => void;
  completeSelection: () => void;
}

/**
 * Hook pour gérer la sélection multiple avec un rectangle
 */
export function useMultiSelection({
  elementDetection,
  selectionBox,
  setSelectionBox
}: UseMultiSelectionProps): UseMultiSelectionResult {
  const { selectElement } = useEditorStore();

  const updateSelectionBox = useCallback(
    (endPoint: Vector2D) => {
      if (!selectionBox.start) return;
      
      setSelectionBox({
        start: selectionBox.start,
        end: endPoint
      });
    },
    [selectionBox.start, setSelectionBox]
  );

  const completeSelection = useCallback(() => {
    if (!selectionBox.start || !selectionBox.end) return;
    
    // Trouver tous les éléments dans la zone de sélection
    const elementsInSelection = elementDetection.findElementsInArea(
      selectionBox.start, 
      selectionBox.end
    );
    
    // Sélectionner ces éléments
    if (elementsInSelection.length > 0) {
      elementsInSelection.forEach(element => {
        selectElement(element.id);
      });
    }
    
    // Réinitialiser le rectangle de sélection
    setSelectionBox({ start: null, end: null });
  }, [selectionBox, elementDetection, selectElement, setSelectionBox]);

  return {
    updateSelectionBox,
    completeSelection
  };
}