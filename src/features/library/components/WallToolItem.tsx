'use client';

import React, { useCallback } from 'react';
import { useEditorStore } from '@/store';
import { cn } from '@/lib/utils';

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
  
  return (
    <div
      className={cn(
        "p-3 border rounded-lg cursor-pointer transition-all flex items-center gap-3",
        isActive 
          ? "bg-pharmacy-primary border-pharmacy-primary-dark shadow-sm" 
          : "bg-white border-gray-200 hover:border-pharmacy-primary hover:shadow-sm"
      )}
      onClick={toggleWallDrawingMode}
    >
      <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
        <svg 
          className={`w-7 h-7 ${isActive ? 'text-white' : 'text-gray-700'}`} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
        >
          <path d="M4 4v16M20 4v16" />
          <path d="M4 12h16" strokeDasharray="2 2" />
        </svg>
      </div>
      <div>
        <h3 className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}>
          Dessiner un mur
        </h3>
        <p className={`text-xs mt-0.5 ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
          {isActive ? 'Mode actif - Cliquez pour arrêter' : 'Cliquez pour commencer à dessiner'}
        </p>
      </div>
    </div>
  );
};

export default WallToolItem;