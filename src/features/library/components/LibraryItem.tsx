'use client';

import React, { useCallback } from 'react';
import { ElementType } from '@/types/elements';
import { DragData } from '../types';

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
  // Style particulier selon le type d'élément
  let bgColor = '';
  let iconContent = '';
  
  // Dimensions par défaut selon le type d'élément
  let defaultWidth = 200;
  let defaultHeight = 120;
  
  switch (type) {
    case ElementType.COUNTER:
      bgColor = 'bg-pharmacy-primary';
      iconContent = 'C';
      defaultWidth = 300;
      defaultHeight = 80;
      break;
    case ElementType.GONDOLA:
      bgColor = 'bg-pharmacy-secondary';
      iconContent = 'G';
      defaultWidth = 200;
      defaultHeight = 400;
      break;
    case ElementType.END_CAP:
      bgColor = 'bg-yellow-500';
      iconContent = 'T';
      defaultWidth = 180;
      defaultHeight = 180;
      break;
    case ElementType.BARGAIN_BIN:
      bgColor = 'bg-red-500';
      iconContent = 'B';
      defaultWidth = 120;
      defaultHeight = 120;
      break;
    default:
      bgColor = 'bg-gray-400';
      iconContent = '?';
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
    ghostElement.classList.add(bgColor, 'rounded-md', 'p-2', 'text-white', 'text-xs');
    ghostElement.textContent = name;
    document.body.appendChild(ghostElement);
    
    // Positionner le fantôme hors de la vue
    ghostElement.style.position = 'absolute';
    ghostElement.style.top = '-1000px';
    
    // Utiliser le fantôme comme image de drag
    e.dataTransfer.setDragImage(ghostElement, 0, 0);
    
    // Nettoyer le fantôme après un court délai
    setTimeout(() => {
      document.body.removeChild(ghostElement);
    }, 0);
  }, [type, name, bgColor, defaultWidth, defaultHeight]);
  
  return (
    <div
      className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer group transition-colors"
      draggable="true"
      data-element-type={type}
      onDragStart={handleDragStart}
    >
      <div className={`w-full h-16 ${bgColor} rounded-md group-hover:opacity-80 flex items-center justify-center text-white font-medium relative`}>
        <span className="text-2xl">{iconContent}</span>
        <div className="absolute bottom-0 left-0 w-full h-3 bg-white/20"></div>
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium">{name}</h3>
        <p className="text-xs text-gray-500 mt-1">
          {description}
        </p>
      </div>
    </div>
  );
};

export default LibraryItem;