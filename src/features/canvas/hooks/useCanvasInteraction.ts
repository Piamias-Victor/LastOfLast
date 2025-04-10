import { useRef, useCallback } from 'react';
import { UseCanvasInteractionProps, CanvasInteractionResult } from '../types';
import { useCoordinateConversion } from './useCoordinateConversion';
import { useElementDetection } from './useElementDetection';
import { useSelectionBox } from './useSelectionBox';
import { useMouseEvents } from './useMouseEvents';
import { useCanvasOperations } from './useCanvasOperations';
import { useMultiSelection } from './useMultiSelection';
import { useCanvasCursor } from './useCanvasCursor';
import { handleMouseMoveAction } from '../utils/canvasEventHandlers';
import { useEditorStore } from '@/store';
import { Vector2D } from '@/types/geometry';

/**
 * Hook principal pour gérer les interactions avec le canvas
 */
export function useCanvasInteraction(
  { canvasRef }: UseCanvasInteractionProps
): CanvasInteractionResult {
  const {
    elements,
    selectedElementIds,
    currentOperation,
    operationStartPoint,
    zoom,
    viewportOffset,
  } = useEditorStore();

  // Référence à l'élément en cours de manipulation
  const activeElementRef = useRef<string | null>(null);
  
  // État pour suivre si la touche Shift est enfoncée
  const shiftKeyRef = useRef<boolean>(false);
  
  // Hooks spécialisés
  const { screenToCanvas } = useCoordinateConversion(canvasRef);
  const elementDetection = useElementDetection(elements);
  const { selectionBox, setSelectionBox, drawSelectionBox } = useSelectionBox(canvasRef, zoom, viewportOffset);
  const { cursor, updateCursor } = useCanvasCursor(elementDetection);
  
  const { 
    startInteraction,
    handleElementMovement,
    handleElementResize,
    handleElementRotation,
    finishOperation
  } = useCanvasOperations({
    elementDetection,
    setSelectionBox
  });
  
  const {
    updateSelectionBox,
    completeSelection
  } = useMultiSelection({
    elementDetection,
    selectionBox,
    setSelectionBox
  });

  // Gestionnaires d'événements pour le canvas
  const onMouseDown = useCallback(
    (position: Vector2D, isShiftKey: boolean) => {
      // Mémoriser l'état de la touche Shift
      shiftKeyRef.current = isShiftKey;
      
      // Démarrer l'interaction appropriée
      const elementId = startInteraction(position, isShiftKey);
      activeElementRef.current = elementId;
    },
    [startInteraction]
  );
  
  const onMouseMove = useCallback(
    (position: Vector2D, isShiftKey: boolean) => {
      // Mettre à jour l'état de la touche Shift
      shiftKeyRef.current = isShiftKey;
      
      // Traiter le mouvement selon l'état actuel
      handleMouseMoveAction(
        position,
        currentOperation,
        activeElementRef.current,
        selectionBox,
        isShiftKey,
        {
          updateCursor,
          updateSelectionBox,
          drawSelectionBox,
          handleElementMovement,
          handleElementResize,
          handleElementRotation
        },
        operationStartPoint
      );
    },
    [
      currentOperation,
      selectionBox,
      operationStartPoint,
      updateCursor,
      updateSelectionBox,
      drawSelectionBox,
      handleElementMovement,
      handleElementResize,
      handleElementRotation
    ]
  );
  
  const onMouseUp = useCallback(() => {
    // Finaliser la sélection multiple si en cours
    if (selectionBox.start && selectionBox.end) {
      completeSelection();
    }
    
    // Terminer l'opération en cours
    if (currentOperation !== 'none') {
      finishOperation();
      activeElementRef.current = null;
      shiftKeyRef.current = false;
    }
  }, [selectionBox, completeSelection, currentOperation, finishOperation]);
  
  // Création des handlers pour les événements DOM
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useMouseEvents({
    canvasRef,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    currentOperation
  });

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    selectionBox,
    cursor
  };
}