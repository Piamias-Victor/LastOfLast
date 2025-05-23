import React from 'react';
import PropertiesPanelContainer from '../containers/PropertiesPanelContainer';

/**
 * Composant principal du panneau de propriétés (point d'entrée simplifié)
 */
const PropertiesPanel: React.FC = () => {
  return (
    <div className="h-full bg-gray-50/30">
      <PropertiesPanelContainer />
    </div>
  );
};

export default PropertiesPanel;