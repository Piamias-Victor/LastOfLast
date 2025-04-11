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
      bgColor = 'bg-pharmacy-accent';
      iconContent = 'G';
      defaultWidth = 200;
      defaultHeight = 400;
      break;
    case ElementType.END_CAP:
      bgColor = 'bg-pharmacy-warning';
      iconContent = 'T';
      defaultWidth = 180;
      defaultHeight = 180;
      break;
    case ElementType.BARGAIN_BIN:
      bgColor = 'bg-pharmacy-danger';
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
      className="p-4 border border-gray-100/80 bg-white rounded-lg hover:shadow-md cursor-pointer group transition-all duration-300"
      draggable="true"
      data-element-type={type}
      onDragStart={handleDragStart}
    >
      <div className={`w-full h-16 ${bgColor}/95 rounded-md shadow-sm group-hover:${bgColor} flex items-center justify-center text-white font-medium relative transition-colors`}>
        <span className="text-2xl">{iconContent}</span>
        <div className="absolute bottom-0 left-0 w-full h-3 bg-white/10"></div>
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-medium text-gray-900">{name}</h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default LibraryItem;