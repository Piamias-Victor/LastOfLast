'use client';

import { EDITOR_COLORS } from '@/lib/constants/editor';
import { GridDrawOptions } from '../types';

/**
 * Dessine une grille sur le canvas
 */
export function drawGrid(
  context: CanvasRenderingContext2D,
  options: GridDrawOptions
): void {
  const { 
    color = EDITOR_COLORS.grid, 
    lineWidth = 1,
    canvasWidth,
    canvasHeight,
    gridSize
  } = options;
  
  // Configurer le style de la grille
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  
  // Dessiner les lignes verticales
  for (let x = 0; x <= canvasWidth; x += gridSize) {
    context.moveTo(x, 0);
    context.lineTo(x, canvasHeight);
  }
  
  // Dessiner les lignes horizontales
  for (let y = 0; y <= canvasHeight; y += gridSize) {
    context.moveTo(0, y);
    context.lineTo(canvasWidth, y);
  }
  
  // Tracer les lignes
  context.stroke();
}

/**
 * Dessine le fond et les bordures du canvas
 */
export function drawCanvasBackground(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  backgroundColor: string = '#ffffff',
  borderColor: string = '#e0e0e0'
): void {
  // Dessiner le fond
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, width, height);
  
  // Dessiner la bordure
  context.strokeStyle = borderColor;
  context.lineWidth = 1;
  context.strokeRect(0, 0, width, height);
}