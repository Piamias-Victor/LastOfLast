'use client';

import React from 'react';

/**
 * Pied de page du canvas avec les indications des raccourcis
 */
const CanvasFooter: React.FC = () => {
  return (
    <div className="text-xs p-2 bg-gray-100 border-t text-gray-500 flex justify-between">
      <div>
        <span className="font-medium">Raccourcis :</span> Échap = Désélectionner, Shift+Clic = Sélection multiple
      </div>
      <div>
        <span className="font-medium">Sélection :</span> Cliquez et glissez dans un espace vide pour sélectionner plusieurs éléments
      </div>
    </div>
  );
};

export default CanvasFooter;