'use client';

import { GondolaElement } from '@/types/elements';
import { createDrawingContext } from './drawingContext';
import { drawSelectionForElement } from './selectionDrawing';

/**
 * Dessine une gondole/rayon sur le canvas avec style minimaliste Apple
 */
export function drawGondola(
  context: CanvasRenderingContext2D,
  gondola: GondolaElement,
  isSelected: boolean = false
): void {
  const { bounds, backgroundColor, borderColor, shelfCount, doubleSided } = gondola;
  const { x, y, width, height } = bounds;
  
  // Créer un contexte de dessin avec des utilitaires
  const drawContext = createDrawingContext(context);
  
  // Sauvegarder l'état du contexte
  drawContext.save();
  
  // Appliquer la rotation si nécessaire
  if (gondola.transform.rotation !== 0) {
    drawContext.transform(gondola);
  }
  
  // Style minimaliste
  const radius = 6; // Rayon de coin arrondi
  
  // Ombre légère
  context.shadowColor = 'rgba(0, 0, 0, 0.08)';
  context.shadowBlur = 8;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 2;
  
  // Fond principal
  context.fillStyle = backgroundColor;
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.fill();
  
  // Réinitialiser l'ombre
  context.shadowColor = 'transparent';
  context.shadowBlur = 0;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  
  // Dessiner les étagères
  if (shelfCount > 0) {
    const shelfSpacing = height / (shelfCount + 1);
    
    for (let i = 1; i <= shelfCount; i++) {
      const shelfY = y + i * shelfSpacing;
      
      // Ligne fine pour les étagères
      context.beginPath();
      context.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      context.lineWidth = 1;
      context.moveTo(x + 2, shelfY);
      context.lineTo(x + width - 2, shelfY);
      context.stroke();
    }
  }
  
  // Dessiner une indication pour double face si nécessaire
  if (doubleSided) {
    // Ligne centrale
    context.beginPath();
    context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    context.lineWidth = 1;
    context.setLineDash([3, 3]);
    context.moveTo(x, y + height / 2);
    context.lineTo(x + width, y + height / 2);
    context.stroke();
    context.setLineDash([]);
    
    // Petits marqueurs aux extrémités
    const markerSize = 5;
    context.fillStyle = 'rgba(255, 255, 255, 0.5)';
    
    // Marqueur gauche
    context.beginPath();
    context.arc(x + markerSize, y + height / 2, markerSize/2, 0, Math.PI * 2);
    context.fill();
    
    // Marqueur droit
    context.beginPath();
    context.arc(x + width - markerSize, y + height / 2, markerSize/2, 0, Math.PI * 2);
    context.fill();
  }
  
  // Bordure fine
  if (borderColor) {
    context.strokeStyle = borderColor;
    context.lineWidth = 1;
    context.beginPath();
    context.roundRect(x, y, width, height, radius);
    context.stroke();
  }
  
  // Restaurer l'état du contexte avant de dessiner la sélection
  drawContext.restore();
  
  // Si l'élément est sélectionné, dessiner la sélection
  if (isSelected) {
    drawSelectionForElement(context, gondola);
  }
}