// src/features/library/components/LibraryPanel.tsx (modification)
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
    <div className="p-4">
      <h2 className="font-semibold mb-4 text-pharmacy-primary">Éléments</h2>
      <div className="space-y-3">
        <WallToolItem />
        
        <div className="border-t pt-3 mt-3">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Mobilier</h3>
        </div>
        
        <LibraryItem
          type={ElementType.COUNTER}
          name="Comptoir"
          description="Comptoir standard pour l'accueil et la délivrance"
          icon="counter"
        />
        <LibraryItem
          type={ElementType.GONDOLA}
          name="Rayon"
          description="Gondole/rayon pour présentation des produits"
          icon="gondola"
        />
        <LibraryItem
          type={ElementType.END_CAP}
          name="Tête de Gondole"
          description="Emplacement stratégique en bout de rayon"
          icon="endcap"
        />
        <LibraryItem
          type={ElementType.BARGAIN_BIN}
          name="Bac Soldeur"
          description="Bac pour produits en promotion ou déstockage"
          icon="bargainbin"
        />
      </div>
    </div>
  );
};

export default LibraryPanel;