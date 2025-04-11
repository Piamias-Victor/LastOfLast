import React from 'react';

/**
 * Panneau affiché quand aucun élément n'est sélectionné
 */
const NoSelectionPanel: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4 tracking-tight">Propriétés</h2>
      <div className="bg-white rounded-lg border border-gray-100/80 shadow-sm p-6 text-center">
        <div className="flex flex-col items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mb-4">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <line x1="15" y1="3" x2="15" y2="21"></line>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="3" y1="15" x2="21" y2="15"></line>
          </svg>
          <p className="text-sm text-gray-500 max-w-xs">
            Sélectionnez un élément sur le canvas pour voir et modifier ses propriétés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoSelectionPanel;