import React from 'react';

/**
 * Panneau affiché quand aucun élément n'est sélectionné
 */
const NoSelectionPanel: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="font-semibold mb-4 text-pharmacy-primary">Propriétés</h2>
      <p className="text-sm text-gray-500">
        Sélectionnez un élément pour voir ses propriétés.
      </p>
    </div>
  );
};

export default NoSelectionPanel;