'use client';

import React from 'react';
import { useEditorStore } from '@/store';

/**
 * Composant pour afficher un indicateur de mode dessin actif
 */
const DrawingModeIndicator: React.FC = () => {
  const { drawingMode, setDrawingMode } = useEditorStore();
  
  if (drawingMode === 'none') return null;
  
  // Messages selon le mode
  const modeMessages = {
    wall: 'Mode dessin de mur actif - Cliquez et glissez pour dessiner'
  };
  
  // Fonction pour annuler le mode dessin
  const cancelDrawingMode = () => {
    setDrawingMode('none');
  };
  
  return (
    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-pharmacy-primary/90 backdrop-blur-sm text-white py-2.5 px-5 rounded-full shadow-md z-30 flex items-center">
      <span className="text-sm font-medium mr-6">
        {modeMessages[drawingMode as keyof typeof modeMessages]}
      </span>
      <button
        className="text-xs px-3 py-1.5 bg-white text-pharmacy-primary rounded-full hover:bg-gray-50 transition-colors"
        onClick={cancelDrawingMode}
      >
        Quitter le mode dessin
      </button>
    </div>
  );
};

export default DrawingModeIndicator;