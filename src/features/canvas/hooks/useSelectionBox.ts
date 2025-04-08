import { useState, useCallback } from 'react';
import { Vector2D } from '@/types/geometry';
import { SelectionBoxResult, SelectionBox } from '../types';
import { drawMultiSelectionBox } from '@/features/drawing';

/**
 * Hook pour gérer la boîte de sélection sur le canvas
 */
export function useSelectionBox(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  zoom: number,
  viewportOffset: Vector2D
): SelectionBoxResult {
  // État pour le rectangle de sélection
  const [selectionBox, setSelectionBox] = useState<SelectionBox>({
    start: null,
    end: null,
  });

  /**
   * Dessine le rectangle de sélection
   */
  const drawSelectionBox = useCallback(() => {
    if (!selectionBox.start || !selectionBox.end || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Sauvegarder le contexte pour appliquer les transformations
    context.save();
    
    // Appliquer les transformations du canvas (zoom et offset)
    context.translate(viewportOffset.x, viewportOffset.y);
    context.scale(zoom, zoom);
    
    // Dessiner le rectangle de sélection
    drawMultiSelectionBox(context, selectionBox.start, selectionBox.end);
    
    // Restaurer le contexte
    context.restore();
  }, [selectionBox, viewportOffset, zoom, canvasRef]);

  return {
    selectionBox,
    setSelectionBox,
    drawSelectionBox
  };
}