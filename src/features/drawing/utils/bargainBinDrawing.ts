'use client';

import { BargainBinElement } from '@/types/elements';
import { createDrawingContext } from './drawingContext';
import { drawSelectionForElement } from './selectionDrawing';

/**
 * Dessine un bac soldeur sur le canvas avec style minimaliste Apple
 */
export function drawBargainBin(
  context: CanvasRenderingContext2D,
  bargainBin: BargainBinElement,
  isSelected: boolean = false
): void {
  const { bounds, backgroundColor, borderColor, isRound, hasSignage, discountLabel } = bargainBin;
  const { x, y, width, height } = bounds;
  
  // Créer un contexte de dessin avec des utilitaires
  const drawContext = createDrawingContext(context);
  
  // Sauvegarder l'état du contexte
  drawContext.save();
  
  // Appliquer la rotation si nécessaire
  if (bargainBin.transform.rotation !== 0) {
    drawContext.transform(bargainBin);
  }
  
  // Ombre légère
  context.shadowColor = 'rgba(0, 0, 0, 0.1)';
  context.shadowBlur = 8;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 2;
  
  // Dessiner le bac selon sa forme
  if (isRound) {
    // Pour un bac rond, on dessine un cercle
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const radius = Math.min(width, height) / 2;
    
    // Cercle principal
    context.fillStyle = backgroundColor;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.fill();
    
    // Cercle intérieur pour effet minimaliste
    context.fillStyle = 'rgba(255, 255, 255, 0.05)';
    context.beginPath();
    context.arc(centerX, centerY, radius * 0.8, 0, Math.PI * 2);
    context.fill();
    
    // Bordure fine
    if (borderColor) {
      context.strokeStyle = borderColor;
      context.lineWidth = 1;
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.stroke();
    }
  } else {
    // Pour un bac rectangulaire
    const cornerRadius = 10;
    
    // Rectangle principal avec coins arrondis
    context.fillStyle = backgroundColor;
    context.beginPath();
    context.roundRect(x, y, width, height, cornerRadius);
    context.fill();
    
    // Rectangle intérieur pour effet minimaliste
    const padding = Math.min(width, height) * 0.1;
    context.fillStyle = 'rgba(255, 255, 255, 0.05)';
    context.beginPath();
    context.roundRect(
      x + padding, 
      y + padding, 
      width - padding * 2, 
      height - padding * 2,
      Math.max(1, cornerRadius - padding/2)
    );
    context.fill();
    
    // Bordure fine
    if (borderColor) {
      context.strokeStyle = borderColor;
      context.lineWidth = 1;
      context.beginPath();
      context.roundRect(x, y, width, height, cornerRadius);
      context.stroke();
    }
  }
  
  // Réinitialiser l'ombre
  context.shadowColor = 'transparent';
  context.shadowBlur = 0;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  
  // Ajouter un affichage promotionnel si nécessaire
  if (hasSignage) {
    const label = discountLabel || '-50%';
    
    // Dans le style Apple, juste afficher le texte de manière simple et élégante
    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(label, x + width/2, y + height/2);
    
    // Ligne horizontale fine au dessus et en dessous du texte
    context.beginPath();
    context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    context.lineWidth = 1;
    
    // Ligne supérieure
    context.moveTo(x + width/2 - 15, y + height/2 - 10);
    context.lineTo(x + width/2 + 15, y + height/2 - 10);
    
    // Ligne inférieure
    context.moveTo(x + width/2 - 15, y + height/2 + 10);
    context.lineTo(x + width/2 + 15, y + height/2 + 10);
    
    context.stroke();
  }
  
  // Restaurer l'état du contexte avant de dessiner la sélection
  drawContext.restore();
  
  // Si l'élément est sélectionné, dessiner la sélection
  if (isSelected) {
    drawSelectionForElement(context, bargainBin);
  }
}