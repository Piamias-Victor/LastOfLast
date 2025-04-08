import { ElementOperation } from '@/states/editorStore';
import { Vector2D, ResizeHandle } from '@/types/geometry';
import { AnyPlanElement } from '@/types/elements';
import { ElementDetectionResult } from '../types';

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
      const resizeHandle = elementDetection.getResizeHandleAtPosition(position, selectedElement);
      if (resizeHandle) {
        // Commencer une opération de redimensionnement
        return {
          operation: ElementOperation.Resize,
          elementId: selectedElement.id,
          handle: resizeHandle
        };
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