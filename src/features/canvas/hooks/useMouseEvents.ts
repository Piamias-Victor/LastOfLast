// src/features/canvas/hooks/useMouseEvents.ts (modification)
import { useCallback, RefObject } from 'react';
import { Vector2D } from '@/types/geometry';
import { useCoordinateConversion } from './useCoordinateConversion';
import { ElementOperation } from '@/store';

interface UseMouseEventsProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  onMouseDown: (position: Vector2D, isShiftKey: boolean) => void;
  onMouseMove: (position: Vector2D, isShiftKey: boolean) => void;
  onMouseUp: (position: Vector2D) => void; // Modifié pour inclure la position
  currentOperation: ElementOperation;
}

interface UseMouseEventsResult {
  handleMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void; // Modifié pour inclure l'événement
}

/**
 * Hook pour gérer les événements souris de base du canvas
 */
export function useMouseEvents({
  canvasRef,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  currentOperation
}: UseMouseEventsProps): UseMouseEventsResult {
  const { screenToCanvas } = useCoordinateConversion(canvasRef);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      // Coordonnées du clic dans le canvas
      const position = screenToCanvas(e.clientX, e.clientY);
      
      // Déclencher le callback avec position et état de la touche Shift
      onMouseDown(position, e.shiftKey);
    },
    [screenToCanvas, onMouseDown]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      // Coordonnées actuelles dans le canvas
      const position = screenToCanvas(e.clientX, e.clientY);
      
      // Déclencher le callback avec la position et l'état de la touche Shift
      onMouseMove(position, e.shiftKey);
    },
    [screenToCanvas, onMouseMove]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      // Coordonnées du relâchement dans le canvas
      const position = screenToCanvas(e.clientX, e.clientY);
      
      // Déclencher le callback de fin d'interaction avec la position
      onMouseUp(position);
    },
    [screenToCanvas, onMouseUp]
  );

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
}