'use client';

import { EndCapElement } from '@/types/elements';
import { createDrawingContext } from './drawingContext';
import { drawSelectionForElement } from './selectionDrawing';

/**
 * Dessine une tête de gondole sur le canvas avec style minimaliste Apple
 */
export function drawEndCap(
  context: CanvasRenderingContext2D,
  endCap: EndCapElement,
  isSelected: boolean = false
): void {
  const { bounds, backgroundColor, borderColor, shelfCount, isPremium, highlightColor } = endCap;
  const { x, y, width, height } = bounds;
  
  // Créer un contexte de dessin avec des utilitaires
  const drawContext = createDrawingContext(context);
  
  // Sauvegarder l'état du contexte
  drawContext.save();
  
  // Appliquer la rotation si nécessaire
  if (endCap.transform.rotation !== 0) {
    drawContext.transform(endCap);
  }
  
  // Style minimaliste
  const radius = 8; // Rayon de coin arrondi
  
  // Ombre légère
  context.shadowColor = 'rgba(0, 0, 0, 0.1)';
  context.shadowBlur = 10;
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
  
  // Si c'est un emplacement premium, ajouter un style spécial
  if (isPremium && highlightColor) {
    // Bordure supérieure élégante
    const bannerHeight = 6;
    context.fillStyle = highlightColor;
    context.beginPath();
    context.roundRect(x, y, width, bannerHeight * 2, [radius, radius, 0, 0]);
    context.fill();
    
    // Badge discret Premium
    if (width > 80) {
      context.fillStyle = 'rgba(255, 255, 255, 0.9)';
      context.font = '9px sans-serif';
      context.textAlign = 'right';
      context.textBaseline = 'top';
      context.fillText('PREMIUM', x + width - 8, y + 6);
    }
  }
  
  // Dessiner les étagères
  if (shelfCount > 0) {
    const shelfSpacing = height / (shelfCount + 1);
    
    for (let i = 1; i <= shelfCount; i++) {
      const shelfY = y + i * shelfSpacing;
      
      // Ligne fine pour les étagères
      context.beginPath();
      context.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      context.lineWidth = 1;
      context.moveTo(x + 3, shelfY);
      context.lineTo(x + width - 3, shelfY);
      context.stroke();
    }
  }
  
  // Indication du centre
  context.beginPath();
  context.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  context.lineWidth = 1;
  context.setLineDash([2, 2]);
  context.moveTo(x + width/2, y + 5);
  context.lineTo(x + width/2, y + height - 5);
  context.stroke();
  context.setLineDash([]);
  
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
    drawSelectionForElement(context, endCap);
  }
}