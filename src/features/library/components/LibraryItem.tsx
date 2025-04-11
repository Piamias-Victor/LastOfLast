'use client';

import React, { useCallback } from 'react';
import { ElementType } from '@/types/elements';
import { DragData } from '../types';
import { cn } from '@/lib/utils';

interface LibraryItemProps {
  type: ElementType;
  name: string;
  description: string;
  icon: string;
}

/**
 * Élément individuel dans la bibliothèque
 */
const LibraryItem: React.FC<LibraryItemProps> = ({ type, name, description }) => {
  // Dimensions par défaut selon le type d'élément
  let defaultWidth = 200;
  let defaultHeight = 120;
  
  // Configuration selon le type d'élément - utilisation de styles inline pour les couleurs
  // qui correspondent exactement à celles du canvas
  let backgroundColor = "#0A5B91"; // Couleur par défaut (pharmacy-primary)
  let textIcon = "C";
  
  switch (type) {
    case ElementType.COUNTER:
      backgroundColor = "#0A5B91"; // Bleu pharmacy-primary
      textIcon = "C";
      defaultWidth = 300;
      defaultHeight = 80;
      break;
    case ElementType.GONDOLA:
      backgroundColor = "#66A5AD"; // Bleu-vert pharmacy-accent
      textIcon = "G";
      defaultWidth = 200;
      defaultHeight = 400;
      break;
    case ElementType.END_CAP:
      backgroundColor = "#F59E0B"; // Orange/Ambre
      textIcon = "TG";
      defaultWidth = 180;
      defaultHeight = 180;
      break;
    case ElementType.BARGAIN_BIN:
      backgroundColor = "#E63946"; // Rouge
      textIcon = "BS";
      defaultWidth = 120;
      defaultHeight = 120;
      break;
    case ElementType.WALL:
      backgroundColor = "#1E293B"; // Gris foncé
      textIcon = "M";
      defaultWidth = 200;
      defaultHeight = 20;
      break;
    default:
      backgroundColor = "#475569"; // Gris
      textIcon = "?";
  }
  
  // Gestionnaire de début de drag
  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    // Créer les données à transférer
    const dragData: DragData = {
      type,
      width: defaultWidth,
      height: defaultHeight
    };
    
    // Définir les données de transfert
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    
    // Définir l'effet de copie
    e.dataTransfer.effectAllowed = 'copy';
    
    // Créer une image fantôme pour le drag
    const ghostElement = document.createElement('div');
    ghostElement.style.backgroundColor = backgroundColor;
    ghostElement.style.color = "white";
    ghostElement.style.padding = "8px";
    ghostElement.style.borderRadius = "6px";
    ghostElement.style.fontSize = "12px";
    ghostElement.textContent = name;
    document.body.appendChild(ghostElement);
    
    // Positionner le fantôme hors de la vue
    ghostElement.style.position = 'absolute';
    ghostElement.style.top = '-1000px';
    
    // Utiliser le fantôme comme image de drag
    e.dataTransfer.setDragImage(ghostElement, 0, 0);
    
    // Nettoyer le fantôme après un court délai
    setTimeout(() => {
      if (document.body.contains(ghostElement)) {
        document.body.removeChild(ghostElement);
      }
    }, 0);
  }, [type, defaultWidth, defaultHeight, name, backgroundColor]);
  
  return (
    <div
      className="p-3 border border-gray-200 rounded-lg bg-white hover:border-pharmacy-primary hover:shadow-sm cursor-grab transition-all transform hover:-translate-y-0.5"
      draggable="true"
      data-element-type={type}
      onDragStart={handleDragStart}
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-sm"
          style={{ backgroundColor }}
        >
          <span className="text-xl font-medium">{textIcon}</span>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">{name}</h3>
          <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LibraryItem;