import { useCallback } from 'react';
import { ResizeHandle, Vector2D } from '@/types/geometry';
import { AnyPlanElement } from '@/types/elements';
import { snapPointToGrid } from '@/lib/utils';
import { 
  calculateResizeValues, 
  normalizeResizeValues, 
  applyGridToResizeValues 
} from '../utils/resizeUtils';
import { ElementOperationResult } from '../types';
import { useEditorStore } from '@/store';
import { snapAngleToInterval, rotatePoint, rotateVector } from '@/lib/utils/rotationUtils';
import { useAlignment } from '@/features/alignment';

/**
 * Hook pour gérer les opérations sur les éléments (déplacement, redimensionnement, rotation)
 */
export function useElementOperation(): ElementOperationResult {
  const { elements, updateElement, snapToGrid, gridSize } = useEditorStore();
  const { checkAlignment, clearGuides } = useAlignment();

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
    
    // Appliquer l'alignement automatique
    const alignedPosition = checkAlignment(elementId, { x: newX, y: newY });
    
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
  }, [elements, updateElement, snapToGrid, gridSize, checkAlignment]);

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
    
    // Effacer les guides d'alignement (on ne les utilise pas pour la sélection multiple)
    clearGuides();
  }, [elements, updateElement, snapToGrid, gridSize, clearGuides]);

  /**
   * Redimensionne un élément en tenant compte de sa rotation
   */
  const resizeElement = useCallback((
    element: AnyPlanElement,
    startPoint: Vector2D,
    currentPoint: Vector2D,
    handle: ResizeHandle
  ) => {
    const { bounds, transform } = element;
    const rotation = transform.rotation;
    const center = {
      x: bounds.x + bounds.width / 2,
      y: bounds.y + bounds.height / 2
    };
    
    // Si l'élément est pivoté, nous devons ajuster les points pour le calcul
    let adjustedStartPoint = startPoint;
    let adjustedCurrentPoint = currentPoint;
    
    if (rotation !== 0) {
      // Inverser la rotation des points pour les calculs
      adjustedStartPoint = rotatePoint(startPoint, center, -rotation);
      adjustedCurrentPoint = rotatePoint(currentPoint, center, -rotation);
    }
    
    // Calculer le delta dans l'espace non pivoté
    const dx = adjustedCurrentPoint.x - adjustedStartPoint.x;
    const dy = adjustedCurrentPoint.y - adjustedStartPoint.y;
    
    // Obtenir les valeurs originales
    const originalX = bounds.x;
    const originalY = bounds.y;
    const originalWidth = bounds.width;
    const originalHeight = bounds.height;
    
    // Calculer les nouvelles valeurs dans l'espace non pivoté
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
    
    // Recalculer le centre après redimensionnement
    const newCenter = {
      x: newX + newWidth / 2,
      y: newY + newHeight / 2
    };
    
    // Ajuster la position pour maintenir la position du centre
    // Ce calcul est important pour que le redimensionnement soit cohérent avec la rotation
    if (rotation !== 0) {
      // Calculer l'offset dû au changement de centre
      const offsetX = newCenter.x - center.x;
      const offsetY = newCenter.y - center.y;
      
      // Appliquer la rotation à l'offset
      const rotatedOffset = rotateVector({ x: offsetX, y: offsetY }, rotation);
      
      // Ajuster la position pour maintenir l'alignement
      newX = originalX + rotatedOffset.x;
      newY = originalY + rotatedOffset.y;
      
      // Recalculer le centre final
      newCenter.x = newX + newWidth / 2;
      newCenter.y = newY + newHeight / 2;
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
        ...transform,
        position: { x: newX, y: newY },
      },
    });
    
    // Effacer les guides d'alignement (on ne les utilise pas pour le redimensionnement)
    clearGuides();
  }, [updateElement, snapToGrid, gridSize, clearGuides]);

  /**
   * Fait pivoter un élément
   */
  const rotateElementOperation = useCallback((
    element: AnyPlanElement,
    center: Vector2D,
    startPoint: Vector2D,
    currentPoint: Vector2D,
    shiftKey: boolean
  ) => {
    // Calculer les angles
    const startAngle = Math.atan2(startPoint.y - center.y, startPoint.x - center.x);
    const currentAngle = Math.atan2(currentPoint.y - center.y, currentPoint.x - center.x);
    
    // Calculer la différence d'angle en degrés
    const deltaAngle = (currentAngle - startAngle) * (180 / Math.PI);
    
    // Ajouter la rotation actuelle de l'élément
    let newRotation = element.transform.rotation + deltaAngle;
    
    // Appliquer le snap si la touche Shift est enfoncée
    if (shiftKey) {
      newRotation = snapAngleToInterval(newRotation, 15, true);
    }
    
    // Normaliser la rotation entre 0 et 360 degrés
    newRotation = ((newRotation % 360) + 360) % 360;
    
    // Mettre à jour l'élément
    updateElement(element.id, {
      transform: {
        ...element.transform,
        rotation: newRotation,
      },
    });
    
    // Effacer les guides d'alignement (on ne les utilise pas pour la rotation)
    clearGuides();
  }, [updateElement, clearGuides]);

  return {
    moveElement,
    moveMultipleElements,
    resizeElement,
    rotateElement: rotateElementOperation
  };
}