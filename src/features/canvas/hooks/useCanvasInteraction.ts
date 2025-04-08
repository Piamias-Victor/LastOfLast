import { useCallback, useRef } from 'react';
import { UseCanvasInteractionProps, CanvasInteractionResult } from '../types';
import { useCoordinateConversion } from './useCoordinateConversion';
import { useElementDetection } from './useElementDetection';
import { useElementOperation } from './useElementOperation';
import { useSelectionBox } from './useSelectionBox';
import { useCursor } from '../utils/cursorUtils';
import { determineOperation } from '../utils/operationUtils';
import { useEditorStore, ElementOperation } from '@/store';

/**
 * Hook principal pour gérer les interactions avec le canvas
 */
export function useCanvasInteraction(
  { canvasRef }: UseCanvasInteractionProps
): CanvasInteractionResult {
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
    zoom,
    viewportOffset,
  } = useEditorStore();

  // Référence à l'élément en cours de manipulation
  const activeElementRef = useRef<string | null>(null);
  
  // Hooks spécialisés
  const { screenToCanvas } = useCoordinateConversion(canvasRef);
  const elementDetection = useElementDetection(elements);
  const { moveElement, moveMultipleElements, resizeElement } = useElementOperation();
  const { selectionBox, setSelectionBox, drawSelectionBox } = useSelectionBox(canvasRef, zoom, viewportOffset);
  const { cursor, updateCursor } = useCursor(elementDetection, selectedElementIds, elements, currentOperation);

  /**
   * Gestionnaire d'événement pour le début d'une interaction
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      // Coordonnées du clic dans le canvas
      const position = screenToCanvas(e.clientX, e.clientY);

      // Déterminer l'opération à effectuer
      const { operation, elementId, handle } = determineOperation(
        position,
        elementDetection,
        selectedElementIds,
        elements
      );

      if (operation === ElementOperation.Resize && elementId) {
        // Commencer une opération de redimensionnement
        activeElementRef.current = elementId;
        startOperation(ElementOperation.Resize, position, handle);
        return;
      }

      if (operation === ElementOperation.Move && elementId) {
        // Vérifier si on maintient la touche Shift pour la sélection multiple
        if (e.shiftKey) {
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
        activeElementRef.current = elementId;
        startOperation(ElementOperation.Move, position);
      } else {
        // Clic dans le vide, commencer un rectangle de sélection
        // sauf si on maintient la touche Shift
        if (!e.shiftKey) {
          deselectAll();
        }
        
        // Initialiser le rectangle de sélection
        setSelectionBox({
          start: position,
          end: position,
        });
      }
    },
    [
      screenToCanvas,
      elementDetection,
      selectedElementIds,
      elements,
      deselectAll,
      selectElement,
      startOperation,
      setSelectionBox
    ]
  );

  /**
   * Gestionnaire d'événement pour le déplacement pendant une interaction
   */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      // Coordonnées actuelles dans le canvas
      const currentPosition = screenToCanvas(e.clientX, e.clientY);
      
      // Mettre à jour le curseur
      updateCursor(currentPosition);
      
      // Si un rectangle de sélection est en cours
      if (selectionBox.start) {
        setSelectionBox({
          start: selectionBox.start,
          end: currentPosition,
        });
        
        // Redessiner la scène avec le rectangle de sélection
        requestAnimationFrame(drawSelectionBox);
        return;
      }

      // Si aucune opération n'est en cours, sortir
      if (currentOperation === ElementOperation.None || !operationStartPoint) return;

      if (currentOperation === ElementOperation.Resize && activeResizeHandle && activeElementRef.current) {
        // Redimensionnement
        const elementId = activeElementRef.current;
        const element = elements.find((el) => el.id === elementId);
        
        if (element) {
            resizeElement(element, operationStartPoint, currentPosition, activeResizeHandle);
          
          // Mettre à jour le point de départ pour le prochain mouvement
          startOperation(ElementOperation.Resize, currentPosition, activeResizeHandle);
        }
      } else if (currentOperation === ElementOperation.Move) {
        // Vérifier si on déplace plusieurs éléments
        if (selectedElementIds.length > 1) {
          // Déplacer tous les éléments sélectionnés
          moveMultipleElements(selectedElementIds, operationStartPoint, currentPosition);
        } else if (activeElementRef.current) {
          // Déplacer un seul élément
          moveElement(activeElementRef.current, operationStartPoint, currentPosition);
        }

        // Mettre à jour le point de départ pour le prochain mouvement
        startOperation(ElementOperation.Move, currentPosition);
      }
    },
    [
      screenToCanvas,
      updateCursor,
      selectionBox,
      setSelectionBox,
      drawSelectionBox,
      currentOperation,
      operationStartPoint,
      activeResizeHandle,
      elements,
      selectedElementIds,
      moveMultipleElements,
      moveElement,
      resizeElement,
      startOperation
    ]
  );

  /**
   * Gestionnaire d'événement pour la fin d'une interaction
   */
  const handleMouseUp = useCallback(() => {
    // Si un rectangle de sélection est en cours
    if (selectionBox.start && selectionBox.end) {
      // Trouver tous les éléments dans la zone de sélection
      const elementsInSelection = elementDetection.findElementsInArea(
        selectionBox.start, 
        selectionBox.end
      );
      
      // Sélectionner ces éléments
      if (elementsInSelection.length > 0) {
        elementsInSelection.forEach(element => {
          selectElement(element.id);
        });
      }
      
      // Réinitialiser le rectangle de sélection
      setSelectionBox({ start: null, end: null });
    }
    
    // Terminer l'opération en cours
    if (currentOperation !== ElementOperation.None) {
      endOperation();
      activeElementRef.current = null;
    }
  }, [
    selectionBox, 
    elementDetection, 
    selectElement, 
    currentOperation, 
    endOperation,
    setSelectionBox
  ]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    selectionBox,
    cursor
  };
}