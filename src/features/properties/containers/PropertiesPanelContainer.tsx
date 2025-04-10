"use client"

import React from 'react';
import { useEditorStore } from '@/store';
import { usePropertiesSelector } from '../hooks/usePropertiesSelector';
import PropertiesFactoryComponent from './PropertiesFactoryComponent';

/**
 * Conteneur pour le panneau de propriétés
 * Gère la logique de sélection et d'affichage
 */
const PropertiesPanelContainer: React.FC = () => {
  const { updateElement } = useEditorStore();
  const { panelType, selectedElement, selectedCount, elementTypes } = usePropertiesSelector();
  
  return (
    <PropertiesFactoryComponent
      panelType={panelType}
      selectedElement={selectedElement}
      selectedCount={selectedCount}
      elementTypes={elementTypes}
      updateElement={updateElement}
    />
  );
};

export default PropertiesPanelContainer;