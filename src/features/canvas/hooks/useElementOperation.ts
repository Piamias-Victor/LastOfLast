import { ElementOperationResult } from '../types';
import { useMoveOperation } from './operations/useMoveOperation';
import { useResizeOperation } from './operations/useResizeOperation';
import { useRotateOperation } from './operations/useRotateOperation';

/**
 * Hook principal pour gérer les opérations sur les éléments (déplacement, redimensionnement, rotation)
 */
export function useElementOperation(): ElementOperationResult {
  // Importer les hooks spécialisés
  const { moveElement, moveMultipleElements } = useMoveOperation();
  const { resizeElement } = useResizeOperation();
  const { rotateElement } = useRotateOperation();

  return {
    moveElement,
    moveMultipleElements,
    resizeElement,
    rotateElement
  };
}