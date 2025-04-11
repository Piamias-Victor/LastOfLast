'use client';

import { CounterElement } from '@/types/elements';
import { createDrawingContext } from './drawingContext';
import { drawSelectionForElement } from './selectionDrawing';

/**
 * Dessine un comptoir sur le canvas avec style minimaliste Apple
 */
export function drawCounter(
  context: CanvasRenderingContext2D,
  counter: CounterElement,
  isSelected: boolean = false
): void {
  const { bounds, backgroundColor, borderColor } = counter;
  const { x, y, width, height } = bounds;
  
  // Créer un contexte de dessin avec des utilitaires
  const drawContext = createDrawingContext(context);
  
  // Sauvegarder l'état du contexte
  drawContext.save();
  
  // Appliquer la rotation si nécessaire
  if (counter.transform.rotation !== 0) {
    drawContext.transform(counter);
  }
  
  // Style minimaliste
  const radius = 8; // Rayon de coin arrondi
  
  // Ombre légère
  context.shadowColor = 'rgba(0, 0, 0, 0.1)';
  context.shadowBlur = 10;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 3;
  
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
  
  // Surface de travail (gradient subtil)
  const gradient = context.createLinearGradient(x, y, x, y + 10);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  context.fillStyle = gradient;
  context.fillRect(x, y, width, 10);
  
  // Séparations pour les postes de travail si multi-postes
  if (counter.stations > 1) {
    context.beginPath();
    context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    context.lineWidth = 1;
    
    const stationWidth = width / counter.stations;
    
    for (let i = 1; i < counter.stations; i++) {
      context.moveTo(x + i * stationWidth, y + 3);
      context.lineTo(x + i * stationWidth, y + height - 3);
    }
    
    context.stroke();
  }
  
  // Indicateur de stockage si disponible
  if (counter.hasStorage) {
    // Ligne subtile indiquant le stockage
    context.beginPath();
    context.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    context.lineWidth = 1;
    context.setLineDash([2, 2]);
    context.moveTo(x + 5, y + height * 0.7);
    context.lineTo(x + width - 5, y + height * 0.7);
    context.stroke();
    context.setLineDash([]);
  }
  
  // Logo PMR pour les comptoirs accessibles
  if (counter.isAccessible) {
    const iconSize = 20;
    const iconX = x + width - iconSize - 8;
    const iconY = y + 8;
    
    // Cercle bleu discret
    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.beginPath();
    context.arc(iconX + iconSize/2, iconY + iconSize/2, iconSize/2, 0, Math.PI * 2);
    context.fill();
    
    // Symbole accessibilité
    context.fillStyle = backgroundColor;
    context.font = `bold ${iconSize/1.5}px sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('♿', iconX + iconSize/2, iconY + iconSize/2);
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
    drawSelectionForElement(context, counter);
  }
}