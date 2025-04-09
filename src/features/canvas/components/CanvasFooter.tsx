'use client';

import React from 'react';

/**
 * Pied de page du canvas avec les indications des raccourcis
 */
const CanvasFooter: React.FC = () => {
  return (
    <div className="text-xs p-2 bg-gray-100 border-t text-gray-500 flex flex-wrap justify-between">
      <div className="mr-4">
        <span className="font-medium">Sélection :</span> Échap = Désélectionner, Shift+Clic = Sélection multiple
      </div>
      <div className="mr-4">
        <span className="font-medium">Rotation :</span> Maintenir R + Flèches ou Cmd/Ctrl + Flèches (avec Shift pour 15°)
      </div>
      <div>
        <span className="font-medium">Redimensionnement :</span> Disponible uniquement quand la rotation est à 0°
      </div>
    </div>
  );
};

export default CanvasFooter;