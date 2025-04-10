import { useCallback } from 'react';
import { Vector2D } from '@/types/geometry';
import { useEditorStore } from '@/store';
import { snapPointToGrid } from '@/lib/utils';
import { useAlignment } from '@/features/alignment';

/**
 * Hook pour fournir des utilitaires de magnétisation (grille et alignement)
 */
export function useSnappingUtils() {
  const { snapToGrid, gridSize } = useEditorStore();
  const { checkAlignment, clearGuides } = useAlignment();

  /**
   * Applique la magnétisation à la grille si nécessaire
   */
  const applyGridSnapping = useCallback((position: Vector2D): Vector2D => {
    if (!snapToGrid) return position;
    
    return {
      x: snapPointToGrid({ x: position.x, y: 0 }, gridSize).x,
      y: snapPointToGrid({ x: 0, y: position.y }, gridSize).y
    };
  }, [snapToGrid, gridSize]);

  /**
   * Applique l'alignement automatique sur un élément
   */
  const applyAlignmentSnapping = useCallback((elementId: string, position: Vector2D): Vector2D => {
    return checkAlignment(elementId, position);
  }, [checkAlignment]);

  /**
   * Nettoie les guides d'alignement
   */
  const clearAlignmentGuides = useCallback(() => {
    clearGuides();
  }, [clearGuides]);

  return {
    applyGridSnapping,
    applyAlignmentSnapping,
    clearAlignmentGuides
  };
}