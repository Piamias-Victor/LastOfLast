// src/features/canvas/components/CanvasFooter.tsx (modification)
'use client';

import React from 'react';
import { useEditorStore } from '@/store';

/**
 * Pied de page du canvas avec les indications des raccourcis
 */
const CanvasFooter: React.FC = () => {
  // Déterminer le raccourci selon la plateforme
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const ctrlKey = isMac ? '⌘' : 'Ctrl';
  
  // Obtenir les dimensions actuelles du canvas
  const { canvasDimensions, canvasUnit, pixelsPerUnit, zoom, viewportOffset } = useEditorStore();
  
  // Calculer les dimensions réelles si nécessaire
  const realWidth = canvasDimensions.width / pixelsPerUnit;
  const realHeight = canvasDimensions.height / pixelsPerUnit;
  
  return (
    <div className="text-xs py-2 px-6 bg-white/90 backdrop-blur-sm border-t border-gray-100/80 text-gray-500 flex flex-wrap justify-between">
      <div className="mr-6">
        <span className="font-medium text-gray-600">Sélection :</span> Échap = Désélectionner, Shift+Clic = Sélection multiple
      </div>
      <div className="mr-6">
        <span className="font-medium text-gray-600">Navigation :</span> Espace+Clic+Glisser = Déplacer, Flèches = Déplacer, Ctrl+Flèches = Déplacer vite
      </div>
      <div className="mr-6">
        <span className="font-medium text-gray-600">Édition :</span> {ctrlKey}+C = Copier, {ctrlKey}+V = Coller, {ctrlKey}+X = Couper
      </div>
      <div className="mr-6">
        <span className="font-medium text-gray-600">Suppression :</span> Touche Delete ou Backspace
      </div>
      
      {/* Ajout des informations sur le zoom et l'offset */}
      <div className="ml-auto bg-pharmacy-primary/5 px-3 py-1 rounded-full text-pharmacy-primary font-medium">
        Zoom: {Math.round(zoom * 100)}% | Position: X:{Math.round(viewportOffset.x)}, Y:{Math.round(viewportOffset.y)} | 
        Dimensions: {canvasDimensions.width} × {canvasDimensions.height} px 
        {canvasUnit !== 'px' && ` (${realWidth.toFixed(2)} × ${realHeight.toFixed(2)} ${canvasUnit})`}
      </div>
    </div>
  );
};

export default CanvasFooter;