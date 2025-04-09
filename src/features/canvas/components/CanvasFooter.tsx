'use client';

import React from 'react';

/**
 * Pied de page du canvas avec les indications des raccourcis
 */
const CanvasFooter: React.FC = () => {
  // Déterminer le raccourci selon la plateforme
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const ctrlKey = isMac ? '⌘' : 'Ctrl';
  
  return (
    <div className="text-xs p-2 bg-gray-100 border-t text-gray-500 flex flex-wrap justify-between">
      <div className="mr-4">
        <span className="font-medium">Sélection :</span> Échap = Désélectionner, Shift+Clic = Sélection multiple
      </div>
      <div className="mr-4">
        <span className="font-medium">Édition :</span> {ctrlKey}+C = Copier, {ctrlKey}+V = Coller, {ctrlKey}+X = Couper
      </div>
      <div className="mr-4">
        <span className="font-medium">Alignement :</span> Sélectionner plusieurs éléments et utiliser les outils d'alignement
      </div>
      <div className="mr-4">
        <span className="font-medium">Rotation :</span> Maintenir R + Flèches ou {ctrlKey} + Flèches (avec Shift pour 15°)
      </div>
      <div className="mr-4">
        <span className="font-medium">Suppression :</span> Touche Delete ou Backspace
      </div>
    </div>
  );
};

export default CanvasFooter;