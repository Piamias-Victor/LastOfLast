'use client';

import { CounterElement } from '@/types/elements';
import { createDrawingContext } from './drawingContext';
import { drawSelectionForElement } from './selectionDrawing';

/**
 * Dessine un comptoir sur le canvas
 */
export function drawCounter(
  context: CanvasRenderingContext2D,
  counter: CounterElement,
  isSelected: boolean = false
): void {
  const { bounds, backgroundColor, borderColor, borderWidth } = counter;
  const { x, y, width, height } = bounds;
  
  // Créer un contexte de dessin avec des utilitaires
  const drawContext = createDrawingContext(context);
  
  // Sauvegarder l'état du contexte
  drawContext.save();
  
  // Appliquer la rotation si nécessaire
  if (counter.transform.rotation !== 0) {
    drawContext.transform(counter);
  }
  
  // Définir la couleur de remplissage
  context.fillStyle = backgroundColor;
  
  // Dessiner le comptoir
  context.fillRect(x, y, width, height);
  
  // Dessiner les séparations pour les postes de travail
  if (counter.stations > 1) {
    context.beginPath();
    context.strokeStyle = borderColor || '#666666';
    context.lineWidth = 1;
    
    const stationWidth = width / counter.stations;
    
    for (let i = 1; i < counter.stations; i++) {
      context.moveTo(x + i * stationWidth, y);
      context.lineTo(x + i * stationWidth, y + height);
    }
    
    context.stroke();
  }
  
  // Dessiner une indication pour le stockage si disponible
  if (counter.hasStorage) {
    const storageHeight = height / 3;
    context.fillStyle = '#f5f5f5';
    context.fillRect(x + 5, y + height - storageHeight - 5, width - 10, storageHeight);
    
    // Bordure pour le stockage
    context.strokeStyle = borderColor || '#666666';
    context.lineWidth = 1;
    context.strokeRect(x + 5, y + height - storageHeight - 5, width - 10, storageHeight);
  }
  
  // Dessiner la bordure extérieure
  if (borderColor && borderWidth) {
    context.strokeStyle = borderColor;
    context.lineWidth = borderWidth;
    context.strokeRect(x, y, width, height);
  }
  
  // Logo PMR pour les comptoirs accessibles
  if (counter.isAccessible) {
    const iconSize = Math.min(24, height / 2);
    context.fillStyle = '#0073cf'; // Bleu officiel accessibilité
    context.beginPath();
    context.arc(x + width - iconSize, y + iconSize, iconSize / 2, 0, 2 * Math.PI);
    context.fill();
    context.fillStyle = '#ffffff';
    context.font = `bold ${iconSize / 2}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('A', x + width - iconSize, y + iconSize);
  }
  
  // Restaurer l'état du contexte avant de dessiner la sélection
  drawContext.restore();
  
  // Si l'élément est sélectionné, dessiner la sélection
  if (isSelected) {
    drawSelectionForElement(context, counter);
  }
}