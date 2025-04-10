import { useState, useCallback } from 'react';
import { Vector2D } from '@/types/geometry';
import { ElementDetectionResult } from '../types';
import { useEditorStore, ElementOperation } from '@/store';
import { getCursor } from '@/lib/utils/cursorUtils';  // Changé de getBaseCursor à getCursor

interface UseCanvasCursorResult {
  cursor: string;
  updateCursor: (position: Vector2D) => void;
}

/**
 * Hook pour gérer le curseur en fonction des interactions sur le canvas
 */
export function useCanvasCursor(
  elementDetection: ElementDetectionResult
): UseCanvasCursorResult {
  const [cursor, setCursor] = useState<string>('default');
  const { selectedElementIds, elements, currentOperation } = useEditorStore();

  const updateCursor = useCallback((
    position: Vector2D
  ) => {
    // Si une opération est en cours, le curseur est déjà géré
    if (currentOperation !== ElementOperation.None) {
      if (currentOperation === ElementOperation.Rotate) {
        setCursor('grabbing'); // Curseur de rotation active
      }
      return;
    }
    
    // Vérifier si on survole un élément sélectionné
    if (selectedElementIds.length === 1) {
      const selectedElement = elements.find(el => el.id === selectedElementIds[0]);
      if (selectedElement) {
        // Vérifier si on survole la poignée de rotation
        if (elementDetection.isRotationHandleSelected(position, selectedElement)) {
          setCursor('grab'); // Curseur de rotation
          return;
        }
        
        // Vérifier si on survole une poignée de redimensionnement
        const resizeHandle = elementDetection.getResizeHandleAtPosition(position, selectedElement);
        
        if (resizeHandle) {
          // On survole une poignée, mettre à jour le curseur
          setCursor(getCursor(ElementOperation.Resize, resizeHandle));  // Changé de getBaseCursor à getCursor
          return;
        }
      }
    }
    
    // Vérifier si on survole un élément (pour le déplacement)
    const hoveredElement = elementDetection.findElementAtPosition(position);
    setCursor(hoveredElement ? 'move' : 'default');
  }, [currentOperation, selectedElementIds, elements, elementDetection]);

  return {
    cursor,
    updateCursor
  };
}