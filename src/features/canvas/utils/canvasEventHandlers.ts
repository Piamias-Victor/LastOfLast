import { Vector2D } from '@/types/geometry';
import { ElementOperation } from '@/store';
import { AnyPlanElement } from '@/types/elements';
import { SelectionBox } from '../types';

/**
 * Détermine l'action à effectuer lors d'un mouvement de souris selon l'opération en cours
 */
export function handleMouseMoveAction(
  position: Vector2D,
  currentOperation: ElementOperation,
  activeElementId: string | null,
  selectionBox: SelectionBox,
  isShiftKey: boolean,
  handlers: {
    updateCursor: (position: Vector2D) => void;
    updateSelectionBox: (position: Vector2D) => void;
    drawSelectionBox: () => void;
    handleElementMovement: (elementId: string | null, startPoint: Vector2D, currentPoint: Vector2D) => void;
    handleElementResize: (elementId: string | null, startPoint: Vector2D, currentPoint: Vector2D) => void;
    handleElementRotation: (elementId: string | null, startPoint: Vector2D, currentPoint: Vector2D, shiftKey: boolean) => void;
  },
  operationStartPoint: Vector2D | null
): void {
  // Mettre à jour le curseur
  handlers.updateCursor(position);
  
  // Si un rectangle de sélection est en cours
  if (selectionBox.start) {
    handlers.updateSelectionBox(position);
    
    // Redessiner la scène avec le rectangle de sélection
    requestAnimationFrame(handlers.drawSelectionBox);
    return;
  }

  // Si aucune opération n'est en cours, sortir
  if (currentOperation === ElementOperation.None || !operationStartPoint) return;

  // Traiter l'opération en cours
  switch (currentOperation) {
    case ElementOperation.Rotate:
      handlers.handleElementRotation(activeElementId, operationStartPoint, position, isShiftKey);
      break;
      
    case ElementOperation.Resize:
      handlers.handleElementResize(activeElementId, operationStartPoint, position);
      break;
      
    case ElementOperation.Move:
      handlers.handleElementMovement(activeElementId, operationStartPoint, position);
      break;
  }
}