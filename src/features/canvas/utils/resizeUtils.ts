import { ResizeHandle } from "@/types/geometry";
import { snapPointToGrid } from "@/lib/utils";

/**
 * Calcule les nouvelles dimensions lors du redimensionnement
 */
export function calculateResizeValues(
  handle: ResizeHandle,
  originalX: number,
  originalY: number,
  originalWidth: number,
  originalHeight: number,
  dx: number,
  dy: number
) {
  let newX = originalX;
  let newY = originalY;
  let newWidth = originalWidth;
  let newHeight = originalHeight;
  
  // Modifier les valeurs selon la poignée utilisée
  switch (handle) {
    case ResizeHandle.TopLeft:
      newX = originalX + dx;
      newY = originalY + dy;
      newWidth = originalWidth - dx;
      newHeight = originalHeight - dy;
      break;
    case ResizeHandle.Top:
      newY = originalY + dy;
      newHeight = originalHeight - dy;
      break;
    case ResizeHandle.TopRight:
      newY = originalY + dy;
      newWidth = originalWidth + dx;
      newHeight = originalHeight - dy;
      break;
    case ResizeHandle.Right:
      newWidth = originalWidth + dx;
      break;
    case ResizeHandle.BottomRight:
      newWidth = originalWidth + dx;
      newHeight = originalHeight + dy;
      break;
    case ResizeHandle.Bottom:
      newHeight = originalHeight + dy;
      break;
    case ResizeHandle.BottomLeft:
      newX = originalX + dx;
      newWidth = originalWidth - dx;
      newHeight = originalHeight + dy;
      break;
    case ResizeHandle.Left:
      newX = originalX + dx;
      newWidth = originalWidth - dx;
      break;
  }
  
  return { newX, newY, newWidth, newHeight };
}

/**
 * Normaliser les valeurs négatives lors du redimensionnement
 */
export function normalizeResizeValues(
  handle: ResizeHandle,
  originalX: number,
  originalY: number,
  originalWidth: number,
  originalHeight: number,
  newX: number,
  newY: number,
  newWidth: number,
  newHeight: number
) {
  // Assurer que les dimensions restent positives
  if (newWidth < 10) {
    newWidth = 10;
    if ([ResizeHandle.TopLeft, ResizeHandle.Left, ResizeHandle.BottomLeft].includes(handle)) {
      newX = originalX + originalWidth - 10;
    }
  }
  
  if (newHeight < 10) {
    newHeight = 10;
    if ([ResizeHandle.TopLeft, ResizeHandle.Top, ResizeHandle.TopRight].includes(handle)) {
      newY = originalY + originalHeight - 10;
    }
  }
  
  return { newX, newY, newWidth, newHeight };
}

/**
 * Applique la grille aux valeurs de redimensionnement
 */
export function applyGridToResizeValues(
  newX: number,
  newY: number,
  newWidth: number,
  newHeight: number,
  gridSize: number
) {
  const snappedX = snapPointToGrid({ x: newX, y: 0 }, gridSize).x;
  const snappedY = snapPointToGrid({ x: 0, y: newY }, gridSize).y;
  const snappedWidth = snapPointToGrid({ x: newWidth, y: 0 }, gridSize).x;
  const snappedHeight = snapPointToGrid({ x: 0, y: newHeight }, gridSize).y;
  
  return {
    newX: snappedX,
    newY: snappedY,
    newWidth: snappedWidth,
    newHeight: snappedHeight
  };
}