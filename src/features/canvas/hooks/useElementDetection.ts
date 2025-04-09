import { useCallback } from 'react';
import { AnyPlanElement } from '@/types/elements';
import { ResizeHandle, Vector2D } from '@/types/geometry';
import { isPointInRect } from '@/lib/utils';
import { RESIZE_HANDLE_SIZE } from '@/lib/constants/editor';
import { ElementDetectionResult } from '../types';
import { isRotationHandleAtPosition } from '../utils/rotationUtils';
import { rotatePoint } from '@/lib/utils/rotationUtils';

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

        // Si l'élément est pivoté, nous devons vérifier différemment
        if (element.transform.rotation !== 0) {
          // Calculer le centre de l'élément
          const centerX = element.bounds.x + element.bounds.width / 2;
          const centerY = element.bounds.y + element.bounds.height / 2;
          
          // Faire pivoter le point en sens inverse pour vérifier s'il est dans le rectangle non pivoté
          const rotatedPosition = rotatePoint(
            position,
            { x: centerX, y: centerY },
            -element.transform.rotation
          );
          
          // Vérifier si le point pivoté est dans les limites de l'élément
          if (isPointInRect(rotatedPosition, element.bounds)) {
            return element;
          }
        } else {
          // Vérification standard pour les éléments non pivotés
          if (isPointInRect(position, element.bounds)) {
            return element;
          }
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
        
        // Pour les éléments avec rotation, nous vérifions les coins
        if (element.transform.rotation !== 0) {
          // Obtenir les coins de l'élément
          const corners = getElementCorners(element);
          
          // Vérifier si au moins un coin est dans la zone de sélection
          return corners.some(corner => 
            corner.x >= selectionArea.x && 
            corner.x <= selectionArea.x + selectionArea.width &&
            corner.y >= selectionArea.y && 
            corner.y <= selectionArea.y + selectionArea.height
          );
        } else {
          // Vérification standard pour les éléments non pivotés
          const elementBounds = element.bounds;
          
          return (
            elementBounds.x < selectionArea.x + selectionArea.width &&
            elementBounds.x + elementBounds.width > selectionArea.x &&
            elementBounds.y < selectionArea.y + selectionArea.height &&
            elementBounds.y + elementBounds.height > selectionArea.y
          );
        }
      });
    },
    [elements]
  );

  /**
   * Vérifie si un point est sur une poignée de redimensionnement d'un élément
   */
  const getResizeHandleAtPosition = useCallback(
    (position: Vector2D, element: AnyPlanElement): ResizeHandle | null => {
      const { bounds, transform } = element;
      const { x, y, width, height } = bounds;
      
      // Taille de la zone de poignée
      const handleSize = RESIZE_HANDLE_SIZE;
      const halfHandle = handleSize / 2;
      
      // Zone de détection agrandie pour faciliter la sélection
      const hitAreaPadding = 4; // Détection plus large que la poignée visible
      
      // Calculer les positions des poignées en tenant compte de la rotation
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      
      // Positions de base des poignées
      const handlePositions = [
        { handle: ResizeHandle.TopLeft, x: x - halfHandle, y: y - halfHandle },
        { handle: ResizeHandle.Top, x: x + width / 2 - halfHandle, y: y - halfHandle },
        { handle: ResizeHandle.TopRight, x: x + width - halfHandle, y: y - halfHandle },
        { handle: ResizeHandle.Right, x: x + width - halfHandle, y: y + height / 2 - halfHandle },
        { handle: ResizeHandle.BottomRight, x: x + width - halfHandle, y: y + height - halfHandle },
        { handle: ResizeHandle.Bottom, x: x + width / 2 - halfHandle, y: y + height - halfHandle },
        { handle: ResizeHandle.BottomLeft, x: x - halfHandle, y: y + height - halfHandle },
        { handle: ResizeHandle.Left, x: x - halfHandle, y: y + height / 2 - halfHandle },
      ];
      
      // Appliquer la rotation aux positions des poignées
      const rotatedHandles = handlePositions.map(handle => ({
        ...handle,
        ...rotatePoint({ x: handle.x + halfHandle, y: handle.y + halfHandle }, { x: centerX, y: centerY }, transform.rotation)
      }));
      
      // Si l'élément est pivoté, nous devons vérifier différemment
      if (transform.rotation !== 0) {
        // Vérifier si le point est sur une poignée pivotée
        for (const handleData of rotatedHandles) {
          if (
            position.x >= handleData.x - halfHandle - hitAreaPadding &&
            position.x <= handleData.x + halfHandle + hitAreaPadding &&
            position.y >= handleData.y - halfHandle - hitAreaPadding &&
            position.y <= handleData.y + halfHandle + hitAreaPadding
          ) {
            return handleData.handle;
          }
        }
      } else {
        // Vérification standard pour les éléments non pivotés
        for (const handleData of handlePositions) {
          if (
            position.x >= handleData.x - hitAreaPadding &&
            position.x <= handleData.x + handleSize + hitAreaPadding &&
            position.y >= handleData.y - hitAreaPadding &&
            position.y <= handleData.y + handleSize + hitAreaPadding
          ) {
            return handleData.handle;
          }
        }
      }
      
      return null;
    },
    []
  );

  /**
   * Vérifie si un point est sur la poignée de rotation d'un élément
   */
  const isRotationHandleSelected = useCallback(
    (position: Vector2D, element: AnyPlanElement): boolean => {
      return isRotationHandleAtPosition(position, element);
    },
    []
  );

  return {
    findElementAtPosition,
    findElementsInArea,
    getResizeHandleAtPosition,
    isRotationHandleSelected
  };
}

/**
 * Obtient les quatre coins d'un élément en tenant compte de sa rotation
 */
function getElementCorners(element: AnyPlanElement): Vector2D[] {
  const { bounds, transform } = element;
  const { x, y, width, height } = bounds;
  const center = { x: x + width / 2, y: y + height / 2 };
  
  // Coins de base (sans rotation)
  const corners = [
    { x, y }, // Top-Left
    { x: x + width, y }, // Top-Right
    { x: x + width, y: y + height }, // Bottom-Right
    { x, y: y + height } // Bottom-Left
  ];
  
  // Appliquer la rotation à chaque coin
  return corners.map(corner => rotatePoint(corner, center, transform.rotation));
}