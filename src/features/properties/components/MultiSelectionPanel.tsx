import React from 'react';
import { ElementType } from '@/types/elements';
import { MultiSelectionPanelProps } from '../types';

/**
 * Panneau affiché quand plusieurs éléments sont sélectionnés
 */
const MultiSelectionPanel: React.FC<MultiSelectionPanelProps> = ({
  selectedCount,
  elementTypes
}) => {
  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-2 tracking-tight">Sélection Multiple</h2>
      <p className="text-sm text-gray-500 mb-6">
        {selectedCount} éléments sélectionnés
      </p>
      
      <div className="bg-white rounded-lg border border-gray-100/80 shadow-sm p-6 mb-6">
        <h3 className="text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">Types d'éléments</h3>
        <div className="space-y-3">
          {elementTypes.map(type => (
            <div key={type} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-pharmacy-primary"></div>
              <span className="text-sm text-gray-700">
                {type === ElementType.RECTANGLE ? 'Rectangle' : 
                 type === ElementType.COUNTER ? 'Comptoir' :
                 type === ElementType.GONDOLA ? 'Gondole' :
                 type === ElementType.END_CAP ? 'Tête de Gondole' :
                 type === ElementType.BARGAIN_BIN ? 'Bac Soldeur' :
                 type === ElementType.WALL ? 'Mur' : type}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-50/60 rounded-lg border border-gray-100/80 p-4 text-center">
        <p className="text-xs text-gray-500">
          Sélectionnez un seul élément pour modifier ses propriétés spécifiques.
        </p>
      </div>
    </div>
  );
};

export default MultiSelectionPanel;