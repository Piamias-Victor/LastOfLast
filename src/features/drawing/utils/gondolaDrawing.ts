'use client';

import { GondolaElement } from '@/types/elements';
import { createDrawingContext } from './drawingContext';
import { drawSelectionForElement } from './selectionDrawing';

/**
 * Dessine une gondole/rayon sur le canvas
 */
export function drawGondola(
  context: CanvasRenderingContext2D,
  gondola: GondolaElement,
  isSelected: boolean = false
): void {
  const { bounds, backgroundColor, borderColor, borderWidth, shelfCount, doubleSided, rackColor } = gondola;
  const { x, y, width, height } = bounds;
  
  // Créer un contexte de dessin avec des utilitaires
  const drawContext = createDrawingContext(context);
  
  // Sauvegarder l'état du contexte
  drawContext.save();
  
  // Appliquer la rotation si nécessaire
  if (gondola.transform.rotation !== 0) {
    drawContext.transform(gondola);
  }
  
  // Définir la couleur de remplissage
  context.fillStyle = backgroundColor;
  
  // Dessiner le corps principal de la gondole
  context.fillRect(x, y, width, height);
  
  // Dessiner les étagères
  if (shelfCount > 0) {
    const shelfSpacing = height / (shelfCount + 1);
    context.fillStyle = rackColor || '#e0e0e0';
    
    for (let i = 1; i <= shelfCount; i++) {
      const shelfY = y + i * shelfSpacing;
      context.fillRect(x, shelfY - 2, width, 4);
    }
  }
  
  // Dessiner une indication pour double face si nécessaire
  if (doubleSided) {
    // Dessiner une ligne pointillée au milieu
    context.beginPath();
    context.strokeStyle = borderColor || '#666666';
    context.lineWidth = 1;
    context.setLineDash([3, 3]);
    context.moveTo(x, y + height / 2);
    context.lineTo(x + width, y + height / 2);
    context.stroke();
    context.setLineDash([]);
    
    // Petits triangles indicateurs aux extrémités
    context.fillStyle = borderColor || '#666666';
    
    // Triangle gauche
    context.beginPath();
    context.moveTo(x + 2, y + height / 2 - 5);
    context.lineTo(x + 2, y + height / 2 + 5);
    context.lineTo(x + 10, y + height / 2);
    context.closePath();
    context.fill();
    
    // Triangle droit
    context.beginPath();
    context.moveTo(x + width - 2, y + height / 2 - 5);
    context.lineTo(x + width - 2, y + height / 2 + 5);
    context.lineTo(x + width - 10, y + height / 2);
    context.closePath();
    context.fill();
  }
  
  // Dessiner la bordure extérieure
  if (borderColor && borderWidth) {
    context.strokeStyle = borderColor;
    context.lineWidth = borderWidth;
    context.strokeRect(x, y, width, height);
  }
  
  // Restaurer l'état du contexte avant de dessiner la sélection
  drawContext.restore();
  
  // Si l'élément est sélectionné, dessiner la sélection
  if (isSelected) {
    drawSelectionForElement(context, gondola);
  }
}