// src/features/canvas/hooks/operations/useMoveOperation.ts
import { useCallback } from 'react';
import { Vector2D } from '@/types/geometry';
import { useEditorStore } from '@/store';
import { useSnappingUtils } from './useSnappingUtils';
import { ElementType, WallElement } from '@/types/elements'; // Ajout de l'import pour WallElement

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
    
    // Pour les murs, nous devons aussi mettre à jour les points de début et de fin
    if (element.type === ElementType.WALL) {
      const wallElement = element as WallElement;
      
      // Calculer le décalage entre la position actuelle et la nouvelle position
      const offsetX = alignedPosition.x - element.bounds.x;
      const offsetY = alignedPosition.y - element.bounds.y;
      
      // Mettre à jour le mur avec les nouveaux points de début et de fin
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
        startPoint: {
          x: wallElement.startPoint.x + offsetX,
          y: wallElement.startPoint.y + offsetY,
        },
        endPoint: {
          x: wallElement.endPoint.x + offsetX,
          y: wallElement.endPoint.y + offsetY,
        }
      });
    } else {
      // Pour les autres types d'éléments, mettre à jour normalement
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
    }
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
      
      // Pour les murs, nous devons aussi mettre à jour les points de début et de fin
      if (element.type === ElementType.WALL) {
        const wallElement = element as WallElement;
        
        // Calculer le décalage entre la position actuelle et la nouvelle position
        const offsetX = snappedPosition.x - element.bounds.x;
        const offsetY = snappedPosition.y - element.bounds.y;
        
        // Mettre à jour le mur avec les nouveaux points de début et de fin
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
          startPoint: {
            x: wallElement.startPoint.x + offsetX,
            y: wallElement.startPoint.y + offsetY,
          },
          endPoint: {
            x: wallElement.endPoint.x + offsetX,
            y: wallElement.endPoint.y + offsetY,
          }
        });
      } else {
        // Pour les autres types d'éléments, mettre à jour normalement
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
      }
    });
    
    // Effacer les guides d'alignement (on ne les utilise pas pour la sélection multiple)
    clearAlignmentGuides();
  }, [elements, updateElement, applyGridSnapping, clearAlignmentGuides]);

  return {
    moveElement,
    moveMultipleElements
  };
}