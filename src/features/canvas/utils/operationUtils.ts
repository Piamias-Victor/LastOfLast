import { Vector2D, ResizeHandle } from '@/types/geometry';
import { AnyPlanElement } from '@/types/elements';
import { ElementDetectionResult } from '../types';
import { ElementOperation } from '@/store';

/**
 * Détermine l'opération à effectuer en fonction du clic
 */
export function determineOperation(
  position: Vector2D,
  elementDetection: ElementDetectionResult,
  selectedElementIds: string[],
  elements: AnyPlanElement[]
): {
  operation: ElementOperation;
  elementId: string | null;
  handle: ResizeHandle | null;
} {
  // Vérifier si le clic est sur une poignée de redimensionnement d'un élément sélectionné
  if (selectedElementIds.length === 1) {
    const selectedElement = elements.find(el => el.id === selectedElementIds[0]);
    if (selectedElement) {
      // Vérifier si on clique sur la poignée de rotation
      if (elementDetection.isRotationHandleSelected(position, selectedElement)) {
        return {
          operation: ElementOperation.Rotate,
          elementId: selectedElement.id,
          handle: null
        };
      }
      
      // Vérifier si l'élément est pivoté
      if (selectedElement.transform.rotation === 0) {
        // Vérifier si on clique sur une poignée de redimensionnement (seulement si l'élément n'est pas pivoté)
        const resizeHandle = elementDetection.getResizeHandleAtPosition(position, selectedElement);
        if (resizeHandle) {
          return {
            operation: ElementOperation.Resize,
            elementId: selectedElement.id,
            handle: resizeHandle
          };
        }
      }
    }
  }

  // Trouver l'élément sous le clic
  const clickedElement = elementDetection.findElementAtPosition(position);
  if (clickedElement) {
    // Commencer l'opération de déplacement
    return {
      operation: ElementOperation.Move,
      elementId: clickedElement.id,
      handle: null
    };
  }
  
  // Aucune opération
  return {
    operation: ElementOperation.None,
    elementId: null,
    handle: null
  };
}