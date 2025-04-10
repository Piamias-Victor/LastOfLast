// src/features/library/components/WallToolItem.tsx (nouveau fichier)
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
  const bgClass = isActive ? 'bg-pharmacy-primary' : 'bg-gray-300 hover:bg-gray-200';
  const textClass = isActive ? 'text-white' : 'text-gray-800';
  
  return (
    <div
      className={`p-3 border rounded-md cursor-pointer group transition-colors ${bgClass}`}
      onClick={toggleWallDrawingMode}
    >
      <div className={`w-full h-16 flex items-center justify-center font-medium relative ${textClass}`}>
        <div className="flex flex-col items-center justify-center">
          <span className="text-2xl">|-|</span>
          <span className="text-sm mt-1">Mur</span>
        </div>
      </div>
      <div className="mt-2">
        <h3 className={`text-sm font-medium ${textClass}`}>Outil Mur</h3>
        <p className={`text-xs ${isActive ? 'text-gray-100' : 'text-gray-500'} mt-1`}>
          {isActive ? 'Actif - Cliquez pour désactiver' : 'Cliquez pour dessiner des murs'}
        </p>
      </div>
    </div>
  );
};

export default WallToolItem;