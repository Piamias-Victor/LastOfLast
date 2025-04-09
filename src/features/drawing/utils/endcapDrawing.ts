'use client';

import { EndCapElement } from '@/types/elements';
import { createDrawingContext } from './drawingContext';
import { drawSelectionForElement } from './selectionDrawing';

/**
 * Dessine une tête de gondole sur le canvas
 */
export function drawEndCap(
  context: CanvasRenderingContext2D,
  endCap: EndCapElement,
  isSelected: boolean = false
): void {
  const { bounds, backgroundColor, borderColor, borderWidth, shelfCount, isPremium, highlightColor } = endCap;
  const { x, y, width, height } = bounds;
  
  // Créer un contexte de dessin avec des utilitaires
  const drawContext = createDrawingContext(context);
  
  // Sauvegarder l'état du contexte
  drawContext.save();
  
  // Appliquer la rotation si nécessaire
  if (endCap.transform.rotation !== 0) {
    drawContext.transform(endCap);
  }
  
  // Définir la couleur de remplissage
  context.fillStyle = backgroundColor;
  
  // Dessiner le corps principal de la tête de gondole
  context.fillRect(x, y, width, height);
  
  // Si c'est un emplacement premium, ajouter un style spécial
  if (isPremium && highlightColor) {
    // Dessiner une bordure supérieure colorée
    context.fillStyle = highlightColor;
    context.fillRect(x, y, width, 8);
    
    // Ajouter un dégradé sur les côtés
    const gradient = context.createLinearGradient(x, y, x + width, y);
    gradient.addColorStop(0, highlightColor);
    gradient.addColorStop(0.5, 'transparent');
    gradient.addColorStop(1, highlightColor);
    
    context.fillStyle = gradient;
    context.fillRect(x, y + 8, width, 20);
  }
  
  // Dessiner les étagères
  if (shelfCount > 0) {
    const shelfSpacing = height / (shelfCount + 1);
    context.fillStyle = '#e0e0e0';
    
    for (let i = 1; i <= shelfCount; i++) {
      const shelfY = y + i * shelfSpacing;
      context.fillRect(x, shelfY - 2, width, 4);
    }
  }
  
  // Pour les têtes de gondole, on ajoute des marqueurs d'angles
  context.fillStyle = borderColor || '#666666';
  
  // Coins supérieurs
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x + 15, y);
  context.lineTo(x, y + 15);
  context.closePath();
  context.fill();
  
  context.beginPath();
  context.moveTo(x + width, y);
  context.lineTo(x + width - 15, y);
  context.lineTo(x + width, y + 15);
  context.closePath();
  context.fill();
  
  // Coins inférieurs
  context.beginPath();
  context.moveTo(x, y + height);
  context.lineTo(x + 15, y + height);
  context.lineTo(x, y + height - 15);
  context.closePath();
  context.fill();
  
  context.beginPath();
  context.moveTo(x + width, y + height);
  context.lineTo(x + width - 15, y + height);
  context.lineTo(x + width, y + height - 15);
  context.closePath();
  context.fill();
  
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
    drawSelectionForElement(context, endCap);
  }
}