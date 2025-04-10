// src/features/canvas/components/DrawingModeIndicator.tsx (nouveau fichier)
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
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-pharmacy-primary text-white py-2 px-4 rounded-lg shadow-lg z-30 flex items-center">
      <span className="text-sm mr-4">
        {modeMessages[drawingMode as keyof typeof modeMessages]}
      </span>
      <button
        className="text-xs px-2 py-1 bg-white text-pharmacy-primary rounded hover:bg-gray-100 transition-colors"
        onClick={cancelDrawingMode}
      >
        Quitter le mode dessin
      </button>
    </div>
  );
};

export default DrawingModeIndicator;