import { useCallback } from 'react';
import { Vector2D } from '@/types/geometry';
import { CoordinateConversionResult } from '../types';
import { useEditorStore } from '@/store';

/**
 * Hook pour convertir les coordonnées entre l'écran et le canvas
 */
export function useCoordinateConversion(
  canvasRef: React.RefObject<HTMLCanvasElement>
): CoordinateConversionResult {
  const { zoom, viewportOffset } = useEditorStore();

  /**
   * Convertit les coordonnées de l'écran en coordonnées du canvas
   */
  const screenToCanvas = useCallback(
    (screenX: number, screenY: number): Vector2D => {
      if (!canvasRef.current) return { x: 0, y: 0 };

      const rect = canvasRef.current.getBoundingClientRect();
      const x = (screenX - rect.left - viewportOffset.x) / zoom;
      const y = (screenY - rect.top - viewportOffset.y) / zoom;

      return { x, y };
    },
    [zoom, viewportOffset, canvasRef]
  );

  return { screenToCanvas };
}