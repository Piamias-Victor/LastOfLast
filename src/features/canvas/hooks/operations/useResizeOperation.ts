import { useCallback } from 'react';
import { ResizeHandle, Vector2D } from '@/types/geometry';
import { AnyPlanElement } from '@/types/elements';
import { useEditorStore } from '@/store';
import { useSnappingUtils } from './useSnappingUtils';
import { 
  calculateResizeValues, 
  normalizeResizeValues, 
  applyGridToResizeValues 
} from '../../utils/resizeUtils';
import { rotatePoint, rotateVector } from '@/lib/utils/rotationUtils';

/**
 * Hook pour gérer le redimensionnement d'éléments
 */
export function useResizeOperation() {
  const { updateElement, snapToGrid, gridSize } = useEditorStore();
  const { clearAlignmentGuides } = useSnappingUtils();

  /**
   * Redimensionne un élément, en tenant compte de sa rotation éventuelle
   */
  const resizeElement = useCallback((
    element: AnyPlanElement,
    startPoint: Vector2D,
    currentPoint: Vector2D,
    handle: ResizeHandle
  ): void => {
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
    clearAlignmentGuides();
  }, [updateElement, snapToGrid, gridSize, clearAlignmentGuides]);

  return {
    resizeElement
  };
}