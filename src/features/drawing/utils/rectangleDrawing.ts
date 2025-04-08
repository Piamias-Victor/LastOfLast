'use client';

import { RectangleElement } from '@/types/elements';
import { RectangleDrawOptions } from '../types';
import { createDrawingContext } from './drawingContext';
import { drawSelectionIndicator } from './selectionDrawing';

/**
 * Dessine un rectangle sur le canvas
 */
export function drawRectangle(
  context: CanvasRenderingContext2D,
  rectangle: RectangleElement,
  isSelected: boolean = false,
  options: RectangleDrawOptions = {}
): void {
  const { 
    applyRotation = true, 
    applyCornerRadius = true, 
    applyBorder = true 
  } = options;
  
  const { bounds, cornerRadius, backgroundColor, borderColor, borderWidth } = rectangle;
  const { x, y, width, height } = bounds;
  
  // Créer un contexte de dessin avec des utilitaires
  const drawContext = createDrawingContext(context);
  
  // Sauvegarder l'état du contexte
  drawContext.save();
  
  // Appliquer la rotation si nécessaire
  if (applyRotation && rectangle.transform.rotation !== 0) {
    drawContext.transform(rectangle);
  }
  
  // Définir la couleur de remplissage
  context.fillStyle = backgroundColor;
  
  if (applyCornerRadius && cornerRadius && cornerRadius > 0) {
    // Dessiner un rectangle avec coins arrondis
    drawRoundedRectangle(context, x, y, width, height, cornerRadius);
    context.fill();
    
    // Dessiner la bordure si nécessaire
    if (applyBorder && borderColor && borderWidth) {
      context.strokeStyle = borderColor;
      context.lineWidth = borderWidth;
      context.stroke();
    }
  } else {
    // Dessiner un rectangle normal
    context.fillRect(x, y, width, height);
    
    // Dessiner la bordure si nécessaire
    if (applyBorder && borderColor && borderWidth) {
      context.strokeStyle = borderColor;
      context.lineWidth = borderWidth;
      context.strokeRect(x, y, width, height);
    }
  }
  
  // Si l'élément est sélectionné, dessiner la sélection
  if (isSelected) {
    drawSelectionIndicator(context, bounds);
  }
  
  // Restaurer l'état du contexte
  drawContext.restore();
}

/**
 * Dessine un rectangle avec des coins arrondis
 */
export function drawRoundedRectangle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  // Limiter le rayon à la moitié de la plus petite dimension
  const limitedRadius = Math.min(radius, Math.min(width, height) / 2);
  
  // Tracer le chemin du rectangle avec coins arrondis
  context.beginPath();
  context.moveTo(x + limitedRadius, y);
  context.lineTo(x + width - limitedRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + limitedRadius);
  context.lineTo(x + width, y + height - limitedRadius);
  context.quadraticCurveTo(x + width, y + height, x + width - limitedRadius, y + height);
  context.lineTo(x + limitedRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - limitedRadius);
  context.lineTo(x, y + limitedRadius);
  context.quadraticCurveTo(x, y, x + limitedRadius, y);
  context.closePath();
}