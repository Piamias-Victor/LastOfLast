import { ResizeHandle, Vector2D } from "@/types/geometry";
import { AnyPlanElement } from "@/types/elements";
import { RefObject } from "react";

/**
 * Interface pour le résultat de conversion de coordonnées
 */
export interface CoordinateConversionResult {
  screenToCanvas: (screenX: number, screenY: number) => Vector2D;
}

/**
 * Interface pour les résultats de détection d'éléments
 */
export interface ElementDetectionResult {
  findElementAtPosition: (position: Vector2D) => AnyPlanElement | null;
  findElementsInArea: (start: Vector2D, end: Vector2D) => AnyPlanElement[];
  getResizeHandleAtPosition: (position: Vector2D, element: AnyPlanElement) => ResizeHandle | null;
}

/**
 * Interface pour les opérations d'éléments
 */
export interface ElementOperationResult {
  moveElement: (elementId: string, startPoint: Vector2D, currentPoint: Vector2D) => void;
  moveMultipleElements: (elementIds: string[], startPoint: Vector2D, currentPoint: Vector2D) => void;
  resizeElement: (element: AnyPlanElement, startPoint: Vector2D, currentPoint: Vector2D, handle: ResizeHandle) => void;
}

/**
 * Interface pour la boîte de sélection
 */
export interface SelectionBox {
  start: Vector2D | null;
  end: Vector2D | null;
}

/**
 * Interface pour les résultats de la boîte de sélection
 */
export interface SelectionBoxResult {
  selectionBox: SelectionBox;
  setSelectionBox: (box: SelectionBox) => void;
  drawSelectionBox: () => void;
}

/**
 * Interface pour les résultats d'interaction avec le canvas
 */
export interface CanvasInteractionResult {
  handleMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: () => void;
  selectionBox: SelectionBox;
  cursor: string;
}

/**
 * Interface pour les props du hook useCanvasInteraction
 */
export interface UseCanvasInteractionProps {
  canvasRef: RefObject<HTMLCanvasElement>;
}