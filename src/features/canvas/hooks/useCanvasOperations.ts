import { useCallback } from 'react';
import { Vector2D } from '@/types/geometry';
import { useEditorStore, ElementOperation } from '@/store';
import { determineOperation } from '../utils/operationUtils';
import { ElementDetectionResult } from '../types';
import { useElementOperation } from './useElementOperation';  // Ajouté cette importation

interface UseCanvasOperationsProps {
  elementDetection: ElementDetectionResult;
  setSelectionBox: (selectionBox: { start: Vector2D | null; end: Vector2D | null }) => void;
}

interface UseCanvasOperationsResult {
  startInteraction: (position: Vector2D, isShiftKey: boolean) => string | null;
  handleElementMovement: (elementId: string | null, startPoint: Vector2D, currentPoint: Vector2D) => void;
  handleElementResize: (elementId: string | null, startPoint: Vector2D, currentPoint: Vector2D) => void;
  handleElementRotation: (elementId: string | null, startPoint: Vector2D, currentPoint: Vector2D, shiftKey: boolean) => void;
  finishOperation: () => void;
}

/**
 * Hook pour gérer les opérations de haut niveau sur le canvas
 */
export function useCanvasOperations({
  elementDetection,
  setSelectionBox
}: UseCanvasOperationsProps): UseCanvasOperationsResult {
  const {
    elements,
    selectedElementIds,
    selectElement,
    deselectAll,
    startOperation,
    endOperation,
    currentOperation,
    operationStartPoint,
    activeResizeHandle,
    rotationCenter
  } = useEditorStore();

  // Utiliser les méthodes de useElementOperation
  const { moveElement, moveMultipleElements, resizeElement, rotateElement } = useElementOperation();

  const startInteraction = useCallback(
    (position: Vector2D, isShiftKey: boolean): string | null => {
      // Déterminer l'opération à effectuer
      const { operation, elementId, handle } = determineOperation(
        position,
        elementDetection,
        selectedElementIds,
        elements
      );

      if (operation === ElementOperation.Rotate && elementId) {
        // Trouver l'élément à faire pivoter
        const element = elements.find(el => el.id === elementId);
        if (!element) return null;
        
        // Calculer le centre de l'élément pour la rotation
        const center = {
          x: element.bounds.x + element.bounds.width / 2,
          y: element.bounds.y + element.bounds.height / 2
        };
        
        // Commencer une opération de rotation
        startOperation(ElementOperation.Rotate, position, null, center);
        return elementId;
      }

      if (operation === ElementOperation.Resize && elementId) {
        // Commencer une opération de redimensionnement
        startOperation(ElementOperation.Resize, position, handle);
        return elementId;
      }

      if (operation === ElementOperation.Move && elementId) {
        // Vérifier si on maintient la touche Shift pour la sélection multiple
        if (isShiftKey) {
          // Si l'élément est déjà sélectionné, le désélectionner
          if (selectedElementIds.includes(elementId)) {
            const newSelectedIds = selectedElementIds.filter(id => id !== elementId);
            deselectAll();
            newSelectedIds.forEach(id => selectElement(id));
          } else {
            // Sinon, l'ajouter à la sélection
            selectElement(elementId);
          }
        } else if (!selectedElementIds.includes(elementId)) {
          // Si l'élément n'était pas déjà sélectionné, désélectionner tout et sélectionner celui-ci
          deselectAll();
          selectElement(elementId);
        }

        // Commencer l'opération de déplacement
        startOperation(ElementOperation.Move, position);
        return elementId;
      } else if (operation === ElementOperation.None) {
        // Clic dans le vide, commencer un rectangle de sélection
        // sauf si on maintient la touche Shift
        if (!isShiftKey) {
          deselectAll();
        }
        
        // Initialiser le rectangle de sélection
        setSelectionBox({
          start: position,
          end: position,
        });
      }

      return null;
    },
    [elementDetection, selectedElementIds, elements, startOperation, setSelectionBox, deselectAll, selectElement]
  );

  const handleElementMovement = useCallback(
    (elementId: string | null, startPoint: Vector2D, currentPoint: Vector2D) => {
      if (currentOperation !== ElementOperation.Move || !operationStartPoint) return;

      // Vérifier si on déplace plusieurs éléments
      if (selectedElementIds.length > 1) {
        // Déplacer tous les éléments sélectionnés
        moveMultipleElements(selectedElementIds, operationStartPoint, currentPoint);
      } else if (elementId) {
        // Déplacer un seul élément
        moveElement(elementId, operationStartPoint, currentPoint);
      }

      // Mettre à jour le point de départ pour le prochain mouvement
      startOperation(ElementOperation.Move, currentPoint);
    },
    [currentOperation, operationStartPoint, selectedElementIds, moveMultipleElements, moveElement, startOperation]
  );

  const handleElementResize = useCallback(
    (elementId: string | null, startPoint: Vector2D, currentPoint: Vector2D) => {
      if (currentOperation !== ElementOperation.Resize || !activeResizeHandle || !elementId) return;

      const element = elements.find((el) => el.id === elementId);
      
      if (element) {
        // Appliquer le redimensionnement
        resizeElement(element, operationStartPoint!, currentPoint, activeResizeHandle);
        
        // Mettre à jour le point de départ pour le prochain mouvement
        startOperation(ElementOperation.Resize, currentPoint, activeResizeHandle);
      }
    },
    [currentOperation, activeResizeHandle, elements, resizeElement, operationStartPoint, startOperation]
  );

  const handleElementRotation = useCallback(
    (elementId: string | null, startPoint: Vector2D, currentPoint: Vector2D, shiftKey: boolean) => {
      if (currentOperation !== ElementOperation.Rotate || !rotationCenter || !elementId) return;

      const element = elements.find((el) => el.id === elementId);
      
      if (element) {
        rotateElement(element, rotationCenter, operationStartPoint!, currentPoint, shiftKey);
        
        // Mettre à jour le point de départ pour le prochain mouvement
        startOperation(ElementOperation.Rotate, currentPoint, null, rotationCenter);
      }
    },
    [currentOperation, rotationCenter, elements, rotateElement, operationStartPoint, startOperation]
  );

  const finishOperation = useCallback(() => {
    endOperation();
  }, [endOperation]);

  return {
    startInteraction,
    handleElementMovement,
    handleElementResize,
    handleElementRotation,
    finishOperation
  };
}