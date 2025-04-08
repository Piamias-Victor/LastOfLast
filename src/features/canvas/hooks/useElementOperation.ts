import { useCallback } from 'react';
import { ResizeHandle, Vector2D } from '@/types/geometry';
import { AnyPlanElement } from '@/types/elements';
import { useEditorStore } from '@/states/editorStore';
import { snapPointToGrid } from '@/lib/utils';
import { 
  calculateResizeValues, 
  normalizeResizeValues, 
  applyGridToResizeValues 
} from '../utils/resizeUtils';
import { ElementOperationResult } from '../types';

/**
 * Hook pour gérer les opérations sur les éléments (déplacement, redimensionnement)
 */
export function useElementOperation(): ElementOperationResult {
  const { elements, updateElement, snapToGrid, gridSize } = useEditorStore();

  /**
   * Déplace un élément
   */
  const moveElement = useCallback((
    elementId: string,
    startPoint: Vector2D,
    currentPoint: Vector2D
  ) => {
    // Calculer le décalage depuis le début de l'opération
    const deltaX = currentPoint.x - startPoint.x;
    const deltaY = currentPoint.y - startPoint.y;
    
    const element = elements.find(el => el.id === elementId);
    if (!element) return;
    
    // Calculer la nouvelle position
    let newX = element.bounds.x + deltaX;
    let newY = element.bounds.y + deltaY;
    
    // Appliquer la grille si nécessaire
    if (snapToGrid) {
      newX = snapPointToGrid({ x: newX, y: 0 }, gridSize).x;
      newY = snapPointToGrid({ x: 0, y: newY }, gridSize).y;
    }
    
    // Mettre à jour l'élément
    updateElement(elementId, {
      bounds: {
        ...element.bounds,
        x: newX,
        y: newY,
      },
      transform: {
        ...element.transform,
        position: { x: newX, y: newY },
      },
    });
  }, [elements, updateElement, snapToGrid, gridSize]);

  /**
   * Déplace plusieurs éléments
   */
  const moveMultipleElements = useCallback((
    elementIds: string[],
    startPoint: Vector2D,
    currentPoint: Vector2D
  ) => {
    // Calculer le décalage depuis le début de l'opération
    const deltaX = currentPoint.x - startPoint.x;
    const deltaY = currentPoint.y - startPoint.y;
    
    // Déplacer tous les éléments sélectionnés
    elementIds.forEach(id => {
      const element = elements.find(el => el.id === id);
      if (!element) return;
      
      // Calculer la nouvelle position
      let newX = element.bounds.x + deltaX;
      let newY = element.bounds.y + deltaY;
      
      // Appliquer la grille si nécessaire
      if (snapToGrid) {
        newX = snapPointToGrid({ x: newX, y: 0 }, gridSize).x;
        newY = snapPointToGrid({ x: 0, y: newY }, gridSize).y;
      }
      
      // Mettre à jour l'élément
      updateElement(id, {
        bounds: {
          ...element.bounds,
          x: newX,
          y: newY,
        },
        transform: {
          ...element.transform,
          position: { x: newX, y: newY },
        },
      });
    });
  }, [elements, updateElement, snapToGrid, gridSize]);

  /**
   * Redimensionne un élément
   */
  const resizeElement = useCallback((
    element: AnyPlanElement,
    startPoint: Vector2D,
    currentPoint: Vector2D,
    handle: ResizeHandle
  ) => {
    const { bounds } = element;
    const originalX = bounds.x;
    const originalY = bounds.y;
    const originalWidth = bounds.width;
    const originalHeight = bounds.height;
    
    // Calculer les différences
    const dx = currentPoint.x - startPoint.x;
    const dy = currentPoint.y - startPoint.y;
    
    // Calculer les nouvelles valeurs
    let { newX, newY, newWidth, newHeight } = calculateResizeValues(
      handle,
      originalX,
      originalY,
      originalWidth,
      originalHeight,
      dx,
      dy
    );
    
    // Normaliser les valeurs pour éviter les dimensions négatives
    ({ newX, newY, newWidth, newHeight } = normalizeResizeValues(
      handle,
      originalX,
      originalY,
      originalWidth,
      originalHeight,
      newX,
      newY,
      newWidth,
      newHeight
    ));
    
    // Appliquer la grille si nécessaire
    if (snapToGrid) {
      ({ newX, newY, newWidth, newHeight } = applyGridToResizeValues(
        newX,
        newY,
        newWidth,
        newHeight,
        gridSize
      ));
    }
    
    // Mettre à jour l'élément
    updateElement(element.id, {
      bounds: {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      },
      transform: {
        ...element.transform,
        position: { x: newX, y: newY },
      },
    });
  }, [updateElement, snapToGrid, gridSize]);

  return {
    moveElement,
    moveMultipleElements,
    resizeElement
  };
}