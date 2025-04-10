import { useCallback } from 'react';
import { Vector2D } from '@/types/geometry';
import { useEditorStore } from '@/store';
import { useSnappingUtils } from './useSnappingUtils';

/**
 * Hook pour gérer le déplacement d'éléments
 */
export function useMoveOperation() {
  const { elements, updateElement } = useEditorStore();
  const { applyGridSnapping, applyAlignmentSnapping, clearAlignmentGuides } = useSnappingUtils();

  /**
   * Déplace un seul élément
   */
  const moveElement = useCallback((
    elementId: string,
    startPoint: Vector2D,
    currentPoint: Vector2D
  ): void => {
    // Calculer le décalage depuis le début de l'opération
    const deltaX = currentPoint.x - startPoint.x;
    const deltaY = currentPoint.y - startPoint.y;
    
    const element = elements.find(el => el.id === elementId);
    if (!element) return;
    
    // Calculer la nouvelle position
    let newX = element.bounds.x + deltaX;
    let newY = element.bounds.y + deltaY;
    
    // Appliquer la grille si nécessaire
    const snappedPosition = applyGridSnapping({ x: newX, y: newY });
    newX = snappedPosition.x;
    newY = snappedPosition.y;
    
    // Appliquer l'alignement automatique
    const alignedPosition = applyAlignmentSnapping(elementId, { x: newX, y: newY });
    
    // Mettre à jour l'élément
    updateElement(elementId, {
      bounds: {
        ...element.bounds,
        x: alignedPosition.x,
        y: alignedPosition.y,
      },
      transform: {
        ...element.transform,
        position: { x: alignedPosition.x, y: alignedPosition.y },
      },
    });
  }, [elements, updateElement, applyGridSnapping, applyAlignmentSnapping]);

  /**
   * Déplace plusieurs éléments simultanément
   */
  const moveMultipleElements = useCallback((
    elementIds: string[],
    startPoint: Vector2D,
    currentPoint: Vector2D
  ): void => {
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
      const snappedPosition = applyGridSnapping({ x: newX, y: newY });
      
      // Mettre à jour l'élément
      updateElement(id, {
        bounds: {
          ...element.bounds,
          x: snappedPosition.x,
          y: snappedPosition.y,
        },
        transform: {
          ...element.transform,
          position: { x: snappedPosition.x, y: snappedPosition.y },
        },
      });
    });
    
    // Effacer les guides d'alignement (on ne les utilise pas pour la sélection multiple)
    clearAlignmentGuides();
  }, [elements, updateElement, applyGridSnapping, clearAlignmentGuides]);

  return {
    moveElement,
    moveMultipleElements
  };
}