'use client';

import React, { useCallback } from 'react';
import { useEditorStore } from '@/store';

/**
 * Outil de création de mur dans la bibliothèque
 */
const WallToolItem: React.FC = () => {
  const { setDrawingMode, drawingMode } = useEditorStore();
  
  // Basculer le mode dessin de mur
  const toggleWallDrawingMode = useCallback(() => {
    if (drawingMode === 'wall') {
      setDrawingMode('none');
    } else {
      setDrawingMode('wall');
    }
  }, [drawingMode, setDrawingMode]);
  
  // Style particulier selon l'état actif
  const isActive = drawingMode === 'wall';
  const bgClass = isActive ? 'bg-pharmacy-primary' : 'bg-white hover:shadow-md';
  const textClass = isActive ? 'text-white' : 'text-gray-900';
  const borderClass = isActive ? 'border-pharmacy-primary' : 'border-gray-100/80';
  const descriptionClass = isActive ? 'text-pharmacy-primary-light' : 'text-gray-500';
  
  return (
    <div
      className={`p-4 border ${borderClass} ${bgClass} rounded-lg cursor-pointer transition-all duration-300`}
      onClick={toggleWallDrawingMode}
    >
      <div className={`w-full flex items-center ${textClass}`}>
        <div className="flex-shrink-0 mr-4">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M3 12h18"></path>
              <path d="M3 18h18"></path>
            </svg>
          </div>
        </div>
        <div>
          <h3 className={`text-sm font-medium ${textClass}`}>Outil Mur</h3>
          <p className={`text-xs mt-1 ${isActive ? 'text-white/70' : descriptionClass}`}>
            {isActive ? 'Actif - Cliquez pour désactiver' : 'Cliquez pour dessiner des murs'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WallToolItem;