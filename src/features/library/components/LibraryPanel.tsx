'use client';

import React from 'react';
import { ElementType } from '@/types/elements';
import LibraryItem from './LibraryItem';
import WallToolItem from './WallToolItem';

/**
 * Panel principal de la bibliothèque d'éléments
 */
const LibraryPanel: React.FC = () => {
  // Liste explicite des éléments à afficher
  const libraryItems = [
    {
      type: ElementType.COUNTER,
      name: "Comptoir",
      description: "Point d'accueil et délivrance"
    },
    {
      type: ElementType.GONDOLA,
      name: "Gondole",
      description: "Rayon pour produits standards"
    },
    {
      type: ElementType.END_CAP,
      name: "Tête de Gondole",
      description: "Emplacement promotionnel"
    },
    {
      type: ElementType.BARGAIN_BIN,
      name: "Bac Soldeur",
      description: "Bac pour promos et déstockage"
    }
  ];

  return (
    <div className="h-full overflow-auto bg-gray-50 flex flex-col">
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <h2 className="text-lg font-medium text-pharmacy-primary">Éléments</h2>
      </div>
      
      <div className="p-4 space-y-4 flex-1">
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide px-1">Outils</h3>
          <WallToolItem />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide px-1">Mobilier</h3>
          <div className="grid grid-cols-1 gap-2">
            {libraryItems.map((item) => (
              <LibraryItem
                key={item.type}
                type={item.type}
                name={item.name}
                description={item.description}
                icon=""
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-auto p-3 bg-pharmacy-primary/5 border-t">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-pharmacy-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-gray-700">Glissez-déposez les éléments sur le canvas</span>
        </div>
      </div>
    </div>
  );
};

export default LibraryPanel;