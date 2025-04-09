'use client';

import { BargainBinElement } from '@/types/elements';
import { createDrawingContext } from './drawingContext';
import { drawSelectionForElement } from './selectionDrawing';

/**
 * Dessine un bac soldeur sur le canvas
 */
export function drawBargainBin(
  context: CanvasRenderingContext2D,
  bargainBin: BargainBinElement,
  isSelected: boolean = false
): void {
  const { bounds, backgroundColor, borderColor, borderWidth, isRound, hasSignage, discountLabel } = bargainBin;
  const { x, y, width, height } = bounds;
  
  // Créer un contexte de dessin avec des utilitaires
  const drawContext = createDrawingContext(context);
  
  // Sauvegarder l'état du contexte
  drawContext.save();
  
  // Appliquer la rotation si nécessaire
  if (bargainBin.transform.rotation !== 0) {
    drawContext.transform(bargainBin);
  }
  
  // Définir la couleur de remplissage
  context.fillStyle = backgroundColor;
  
  // Dessiner le bac selon sa forme
  if (isRound) {
    // Pour un bac rond, on dessine un cercle
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const radius = Math.min(width, height) / 2;
    
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.fill();
    
    // Dessiner la bordure si nécessaire
    if (borderColor && borderWidth) {
      context.strokeStyle = borderColor;
      context.lineWidth = borderWidth;
      context.stroke();
    }
    
    // Dessiner l'aspect 3D du bac
    context.fillStyle = 'rgba(0, 0, 0, 0.15)';
    context.beginPath();
    context.arc(centerX, centerY, radius * 0.8, 0, 2 * Math.PI);
    context.fill();
    
    context.fillStyle = backgroundColor;
    context.beginPath();
    context.arc(centerX, centerY, radius * 0.7, 0, 2 * Math.PI);
    context.fill();
  } else {
    // Pour un bac rectangulaire
    const cornerRadius = Math.min(width, height) / 8;
    
    // Dessiner le rectangle arrondi
    context.beginPath();
    context.moveTo(x + cornerRadius, y);
    context.lineTo(x + width - cornerRadius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + cornerRadius);
    context.lineTo(x + width, y + height - cornerRadius);
    context.quadraticCurveTo(x + width, y + height, x + width - cornerRadius, y + height);
    context.lineTo(x + cornerRadius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - cornerRadius);
    context.lineTo(x, y + cornerRadius);
    context.quadraticCurveTo(x, y, x + cornerRadius, y);
    context.closePath();
    context.fill();
    
    // Dessiner la bordure si nécessaire
    if (borderColor && borderWidth) {
      context.strokeStyle = borderColor;
      context.lineWidth = borderWidth;
      context.stroke();
    }
    
    // Dessiner l'aspect 3D du bac
    context.fillStyle = 'rgba(0, 0, 0, 0.15)';
    const innerPadding = Math.min(width, height) / 10;
    context.fillRect(
      x + innerPadding, 
      y + innerPadding, 
      width - innerPadding * 2, 
      height - innerPadding * 2
    );
    
    context.fillStyle = backgroundColor;
    const innerPadding2 = innerPadding * 1.5;
    context.fillRect(
      x + innerPadding2, 
      y + innerPadding2, 
      width - innerPadding2 * 2, 
      height - innerPadding2 * 2
    );
  }
  
  // Ajouter un affichage promotionnel si nécessaire
  if (hasSignage) {
    const signWidth = Math.min(width, height) / 2;
    const signHeight = signWidth / 2;
    const signX = x + width / 2 - signWidth / 2;
    const signY = y - signHeight * 0.8;
    
    // Dessiner le panneau
    context.fillStyle = '#FF4136'; // Rouge vif pour promo
    context.beginPath();
    context.moveTo(signX, signY);
    context.lineTo(signX + signWidth, signY);
    context.lineTo(signX + signWidth, signY + signHeight);
    context.lineTo(signX + signWidth / 2, signY + signHeight * 1.3);
    context.lineTo(signX, signY + signHeight);
    context.closePath();
    context.fill();
    
    // Bordure du panneau
    context.strokeStyle = '#B10000';
    context.lineWidth = 1;
    context.stroke();
    
    // Texte de promotion
    const label = discountLabel || '-50%';
    context.fillStyle = '#FFFFFF';
    context.font = 'bold 14px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(label, signX + signWidth / 2, signY + signHeight / 2);
  }
  
  // Restaurer l'état du contexte avant de dessiner la sélection
  drawContext.restore();
  
  // Si l'élément est sélectionné, dessiner la sélection
  if (isSelected) {
    drawSelectionForElement(context, bargainBin);
  }
}