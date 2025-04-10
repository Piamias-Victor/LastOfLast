// src/features/drawing/utils/wallDrawing.ts (nouveau fichier)
'use client';

import { WallElement } from '@/types/elements';
import { createDrawingContext } from './drawingContext';
import { drawSelectionForElement } from './selectionDrawing';

/**
 * Dessine un mur sur le canvas
 */
export function drawWall(
  context: CanvasRenderingContext2D,
  wall: WallElement,
  isSelected: boolean = false
): void {
  const { startPoint, endPoint, thickness, color } = wall;
  
  // Créer un contexte de dessin avec des utilitaires
  const drawContext = createDrawingContext(context);
  
  // Sauvegarder l'état du contexte
  drawContext.save();
  
  // Appliquer la rotation si nécessaire
  if (wall.transform.rotation !== 0) {
    drawContext.transform(wall);
  }
  
  // Dessiner le mur
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = thickness;
  context.lineCap = 'round';
  context.moveTo(startPoint.x, startPoint.y);
  context.lineTo(endPoint.x, endPoint.y);
  context.stroke();
  
  // Restaurer l'état du contexte avant de dessiner la sélection
  drawContext.restore();
  
  // Si l'élément est sélectionné, dessiner la sélection
  if (isSelected) {
    drawSelectionForElement(context, wall);
  }
}

/**
 * Calcule les bounds d'un mur à partir de ses points et son épaisseur
 */
export function calculateWallBounds(startPoint: { x: number; y: number }, endPoint: { x: number; y: number }, thickness: number): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  const minX = Math.min(startPoint.x, endPoint.x);
  const minY = Math.min(startPoint.y, endPoint.y);
  const maxX = Math.max(startPoint.x, endPoint.x);
  const maxY = Math.max(startPoint.y, endPoint.y);
  
  // Ajouter la moitié de l'épaisseur dans chaque direction
  const halfThickness = thickness / 2;
  
  return {
    x: minX - halfThickness,
    y: minY - halfThickness,
    width: maxX - minX + thickness,
    height: maxY - minY + thickness
  };
}