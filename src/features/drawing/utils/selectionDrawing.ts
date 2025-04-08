'use client';

import { Bounds, Vector2D } from '@/types/geometry';
import { EDITOR_COLORS } from '@/lib/constants/editor';
import { SelectionIndicatorOptions } from '../types';

/**
 * Dessine un indicateur de sélection autour d'une zone
 */
export function drawSelectionIndicator(
  context: CanvasRenderingContext2D,
  bounds: Bounds,
  options: SelectionIndicatorOptions = {}
): void {
  const { 
    padding = 5, 
    handleSize = 12, 
    lineWidth = 2,
    lineDash = [5, 3]
  } = options;
  
  const { x, y, width, height } = bounds;
  
  // Dessiner le cadre de sélection
  context.strokeStyle = EDITOR_COLORS.selection;
  context.lineWidth = lineWidth;
  context.setLineDash(lineDash);
  context.strokeRect(
    x - padding,
    y - padding,
    width + padding * 2,
    height + padding * 2
  );
  
  // Dessiner les poignées de redimensionnement
  drawResizeHandles(context, bounds, handleSize);
}

/**
 * Dessine les poignées de redimensionnement
 */
export function drawResizeHandles(
  context: CanvasRenderingContext2D,
  bounds: Bounds,
  handleSize: number = 12
): void {
  const { x, y, width, height } = bounds;
  const halfHandle = handleSize / 2;
  
  // Réinitialiser le style de ligne
  context.setLineDash([]);
  context.fillStyle = EDITOR_COLORS.resizeHandleFill;
  context.strokeStyle = EDITOR_COLORS.resizeHandle;
  context.lineWidth = 2;
  
  // Positions des poignées (8 poignées)
  const handles = [
    { x: x - halfHandle, y: y - halfHandle }, // Top-Left
    { x: x + width / 2 - halfHandle, y: y - halfHandle }, // Top-Center
    { x: x + width - halfHandle, y: y - halfHandle }, // Top-Right
    { x: x + width - halfHandle, y: y + height / 2 - halfHandle }, // Middle-Right
    { x: x + width - halfHandle, y: y + height - halfHandle }, // Bottom-Right
    { x: x + width / 2 - halfHandle, y: y + height - halfHandle }, // Bottom-Center
    { x: x - halfHandle, y: y + height - halfHandle }, // Bottom-Left
    { x: x - halfHandle, y: y + height / 2 - halfHandle } // Middle-Left
  ];
  
  // Dessiner chaque poignée
  for (const handle of handles) {
    context.beginPath();
    context.rect(handle.x, handle.y, handleSize, handleSize);
    context.fill();
    context.stroke();
  }
}

/**
 * Dessine un cadre de sélection multiple
 */
export function drawMultiSelectionBox(
  context: CanvasRenderingContext2D,
  startPoint: Vector2D,
  endPoint: Vector2D
): void {
  const x = Math.min(startPoint.x, endPoint.x);
  const y = Math.min(startPoint.y, endPoint.y);
  const width = Math.abs(endPoint.x - startPoint.x);
  const height = Math.abs(endPoint.y - startPoint.y);
  
  // Dessiner le rectangle de sélection
  context.fillStyle = EDITOR_COLORS.selectionFill;
  context.fillRect(x, y, width, height);
  
  // Dessiner la bordure du rectangle de sélection
  context.strokeStyle = EDITOR_COLORS.selection;
  context.lineWidth = 2;
  context.setLineDash([5, 3]);
  context.strokeRect(x, y, width, height);
  context.setLineDash([]);
}