import { useState, useCallback } from 'react';
import { ResizeHandle, Vector2D } from '@/types/geometry';
import { AnyPlanElement } from '@/types/elements';
import { getCursor as getBaseCursor } from '@/lib/utils/cursorUtils';
import { ElementDetectionResult } from '../types';
import { ElementOperation } from '@/store';

/**
 * Hook pour gérer le curseur en fonction des interactions
 */
export function useCursor(
  elementDetection: ElementDetectionResult,
  selectedElementIds: string[],
  elements: AnyPlanElement[],
  currentOperation: ElementOperation
) {
  const [cursor, setCursor] = useState<string>('default');
  const [hoveredResizeHandle, setHoveredResizeHandle] = useState<ResizeHandle | null>(null);

  /**
   * Met à jour le curseur en fonction de la position de la souris
   */
  const updateCursor = useCallback((
    currentPosition: Vector2D
  ) => {
    // Si une opération est en cours, le curseur est déjà géré
    if (currentOperation !== ElementOperation.None) return;
    
    // Vérifier si on survole un élément sélectionné
    if (selectedElementIds.length === 1) {
      const selectedElement = elements.find(el => el.id === selectedElementIds[0]);
      if (selectedElement) {
        // Vérifier si on survole une poignée de redimensionnement
        const resizeHandle = elementDetection.getResizeHandleAtPosition(currentPosition, selectedElement);
        
        if (resizeHandle) {
          // On survole une poignée, mettre à jour le curseur
          setHoveredResizeHandle(resizeHandle);
          setCursor(getBaseCursor(ElementOperation.Resize, resizeHandle));
          return;
        }
      }
    }
    
    // Vérifier si on survole un élément (pour le déplacement)
    const hoveredElement = elementDetection.findElementAtPosition(currentPosition);
    if (hoveredElement) {
      setCursor('move');
    } else {
      // Aucun élément ou poignée survolé
      setCursor('default');
      setHoveredResizeHandle(null);
    }
  }, [
    currentOperation,
    selectedElementIds,
    elements,
    elementDetection
  ]);

  return {
    cursor,
    hoveredResizeHandle,
    updateCursor
  };
}