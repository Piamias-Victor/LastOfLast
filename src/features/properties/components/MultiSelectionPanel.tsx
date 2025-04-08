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
    <div className="p-4">
      <h2 className="font-semibold mb-2 text-pharmacy-primary">Sélection Multiple</h2>
      <p className="text-sm mb-4 text-gray-600">
        {selectedCount} éléments sélectionnés
      </p>
      
      {/* Information sur les types d'éléments */}
      <div className="mb-4">
        <h3 className="text-xs font-medium text-gray-700 mb-2">Types d&apos;éléments</h3>
        <div className="space-y-2">
          {elementTypes.map(type => (
            <div key={type} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-pharmacy-secondary"></div>
              <span className="text-sm">
                {type === ElementType.RECTANGLE ? 'Rectangle' : type}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t pt-4 mt-4">
        <p className="text-xs text-gray-500">
          Sélectionnez un seul élément pour modifier ses propriétés spécifiques.
        </p>
      </div>
    </div>
  );
};

export default MultiSelectionPanel;