import { useCallback } from 'react';
import { Vector2D } from '@/types/geometry';
import { AnyPlanElement } from '@/types/elements';
import { useEditorStore } from '@/store';
import { useSnappingUtils } from './useSnappingUtils';
import { snapAngleToInterval } from '@/lib/utils/rotationUtils';

/**
 * Hook pour gérer la rotation d'éléments
 */
export function useRotateOperation() {
  const { updateElement } = useEditorStore();
  const { clearAlignmentGuides } = useSnappingUtils();

  /**
   * Fait pivoter un élément
   */
  const rotateElement = useCallback((
    element: AnyPlanElement,
    center: Vector2D,
    startPoint: Vector2D,
    currentPoint: Vector2D,
    shiftKey: boolean
  ): void => {
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
    clearAlignmentGuides();
  }, [updateElement, clearAlignmentGuides]);

  return {
    rotateElement
  };
}