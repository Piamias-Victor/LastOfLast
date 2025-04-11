'use client';

import React from 'react';
import { ElementType } from '@/types/elements';
import LibraryItem from './LibraryItem';
import WallToolItem from './WallToolItem';

/**
 * Panel principal de la bibliothèque d'éléments
 */
const LibraryPanel: React.FC = () => {
  return (
    <div className="p-6 overflow-auto h-full bg-gray-50/30">
      <h2 className="text-lg font-medium text-gray-900 mb-6 tracking-tight">Bibliothèque</h2>
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-100/80 shadow-sm p-5">
          <h3 className="text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">Outils de dessin</h3>
          <WallToolItem />
        </div>
        
        <div className="bg-white rounded-lg border border-gray-100/80 shadow-sm p-5">
          <h3 className="text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">Mobilier</h3>
          <div className="grid grid-cols-1 gap-4">
            <LibraryItem
              type={ElementType.COUNTER}
              name="Comptoir"
              description="Pour l'accueil et la délivrance"
              icon="counter"
            />
            <LibraryItem
              type={ElementType.GONDOLA}
              name="Gondole"
              description="Rayon principal pour produits"
              icon="gondola"
            />
            <LibraryItem
              type={ElementType.END_CAP}
              name="Tête de Gondole"
              description="Emplacement promotionnel stratégique"
              icon="endcap"
            />
            <LibraryItem
              type={ElementType.BARGAIN_BIN}
              name="Bac Soldeur"
              description="Pour promotions et déstockage"
              icon="bargainbin"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryPanel;