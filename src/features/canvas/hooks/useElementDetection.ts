import { useCallback } from 'react';
import { AnyPlanElement } from '@/types/elements';
import { ResizeHandle, Vector2D } from '@/types/geometry';
import { isPointInRect } from '@/lib/utils';
import { RESIZE_HANDLE_SIZE } from '@/lib/constants/editor';
import { ElementDetectionResult } from '../types';

/**
 * Hook pour la détection d'éléments sur le canvas
 */
export function useElementDetection(
  elements: AnyPlanElement[]
): ElementDetectionResult {
  /**
   * Trouve l'élément sous un point donné
   */
  const findElementAtPosition = useCallback(
    (position: Vector2D): AnyPlanElement | null => {
      // Parcourir les éléments du dernier au premier (ordre d'affichage)
      for (let i = elements.length - 1; i >= 0; i--) {
        const element = elements[i];
        if (!element.isVisible) continue;

        // Vérifier si le point est dans l'élément
        if (isPointInRect(position, element.bounds)) {
          return element;
        }
      }
      return null;
    },
    [elements]
  );

  /**
   * Trouve tous les éléments dans une zone rectangulaire
   */
  const findElementsInArea = useCallback(
    (start: Vector2D, end: Vector2D): AnyPlanElement[] => {
      const selectionArea = {
        x: Math.min(start.x, end.x),
        y: Math.min(start.y, end.y),
        width: Math.abs(end.x - start.x),
        height: Math.abs(end.y - start.y),
      };
      
      return elements.filter((element) => {
        if (!element.isVisible) return false;
        
        const elementBounds = element.bounds;
        
        // Vérifier si l'élément est au moins partiellement dans la zone de sélection
        return (
          elementBounds.x < selectionArea.x + selectionArea.width &&
          elementBounds.x + elementBounds.width > selectionArea.x &&
          elementBounds.y < selectionArea.y + selectionArea.height &&
          elementBounds.y + elementBounds.height > selectionArea.y
        );
      });
    },
    [elements]
  );

  /**
   * Vérifie si un point est sur une poignée de redimensionnement d'un élément
   */
  const getResizeHandleAtPosition = useCallback(
    (position: Vector2D, element: AnyPlanElement): ResizeHandle | null => {
      const { bounds } = element;
      const { x, y, width, height } = bounds;
      
      // Taille de la zone de poignée
      const handleSize = RESIZE_HANDLE_SIZE;
      const halfHandle = handleSize / 2;
      
      // Zone de détection agrandie pour faciliter la sélection
      const hitAreaPadding = 4; // Détection plus large que la poignée visible
      
      // Calculer les positions des poignées
      const handles = [
        { handle: ResizeHandle.TopLeft, x: x - halfHandle, y: y - halfHandle },
        { handle: ResizeHandle.Top, x: x + width / 2 - halfHandle, y: y - halfHandle },
        { handle: ResizeHandle.TopRight, x: x + width - halfHandle, y: y - halfHandle },
        { handle: ResizeHandle.Right, x: x + width - halfHandle, y: y + height / 2 - halfHandle },
        { handle: ResizeHandle.BottomRight, x: x + width - halfHandle, y: y + height - halfHandle },
        { handle: ResizeHandle.Bottom, x: x + width / 2 - halfHandle, y: y + height - halfHandle },
        { handle: ResizeHandle.BottomLeft, x: x - halfHandle, y: y + height - halfHandle },
        { handle: ResizeHandle.Left, x: x - halfHandle, y: y + height / 2 - halfHandle },
      ];
      
      // Vérifier si le point est sur une poignée
      for (const handleData of handles) {
        if (
          position.x >= handleData.x - hitAreaPadding &&
          position.x <= handleData.x + handleSize + hitAreaPadding &&
          position.y >= handleData.y - hitAreaPadding &&
          position.y <= handleData.y + handleSize + hitAreaPadding
        ) {
          return handleData.handle;
        }
      }
      
      return null;
    },
    []
  );

  return {
    findElementAtPosition,
    findElementsInArea,
    getResizeHandleAtPosition
  };
}