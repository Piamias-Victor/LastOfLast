'use client';

import React from 'react';
import { ElementType } from '@/types/elements';
import NoSelectionPanel from './NoSelectionPanel';
import MultiSelectionPanel from './MultiSelectionPanel';
import RectanglePropertiesPanel from './RectanglePropertiesPanel';
import CounterPropertiesPanel from './CounterPropertiesPanel';
import GondolaPropertiesPanel from './GondolaPropertiesPanel';
import EndCapPropertiesPanel from './EndCapPropertiesPanel';
import BargainBinPropertiesPanel from './BargainBinPropertiesPanel';
import { useEditorStore } from '@/store';

/**
 * Panneau principal des propriétés qui affiche le panneau approprié selon la sélection
 */
const PropertiesPanel: React.FC = () => {
  const { elements, selectedElementIds, updateElement } = useEditorStore();
  
  // Pas d'élément sélectionné
  if (selectedElementIds.length === 0) {
    return <NoSelectionPanel />;
  }
  
  // Sélection multiple
  if (selectedElementIds.length > 1) {
    const selectedElements = elements.filter(el => selectedElementIds.includes(el.id));
    const elementTypes = Array.from(new Set(selectedElements.map(el => el.type)));
    
    return (
      <MultiSelectionPanel 
        selectedCount={selectedElementIds.length} 
        elementTypes={elementTypes} 
      />
    );
  }
  
  // Un seul élément sélectionné
  const selectedElement = elements.find(el => el.id === selectedElementIds[0]);
  
  if (!selectedElement) {
    return <NoSelectionPanel />;
  }
  
  // Afficher le panneau approprié selon le type d'élément
  switch (selectedElement.type) {
    case ElementType.RECTANGLE:
      return (
        <RectanglePropertiesPanel 
          element={selectedElement} 
          updateElement={updateElement} 
        />
      );
    case ElementType.COUNTER:
      return (
        <CounterPropertiesPanel 
          element={selectedElement} 
          updateElement={updateElement} 
        />
      );
    case ElementType.GONDOLA:
      return (
        <GondolaPropertiesPanel 
          element={selectedElement} 
          updateElement={updateElement} 
        />
      );
    case ElementType.END_CAP:
      return (
        <EndCapPropertiesPanel 
          element={selectedElement} 
          updateElement={updateElement} 
        />
      );
    case ElementType.BARGAIN_BIN:
      return (
        <BargainBinPropertiesPanel 
          element={selectedElement} 
          updateElement={updateElement} 
        />
      );
    default:
      return (
        <div className="p-4">
          <h2 className="font-semibold mb-4 text-pharmacy-primary">Propriétés</h2>
          <p className="text-sm text-gray-500">
            Type d&apos;élément non géré : {selectedElement.type}
          </p>
        </div>
      );
  }
};

export default PropertiesPanel;