import React from 'react';
import { ElementType, AnyPlanElement } from '@/types/elements';
import NoSelectionPanel from '../components/NoSelectionPanel';
import MultiSelectionPanel from '../components/MultiSelectionPanel';
import RectanglePropertiesPanel from '../components/RectanglePropertiesPanel';
import CounterPropertiesPanel from '../components/CounterPropertiesPanel';
import GondolaPropertiesPanel from '../components/GondolaPropertiesPanel';
import EndCapPropertiesPanel from '../components/EndCapPropertiesPanel';
import BargainBinPropertiesPanel from '../components/BargainBinPropertiesPanel';
import { PanelType } from '../hooks/usePropertiesSelector';

interface PropertiesFactoryProps {
  panelType: PanelType;
  selectedElement: AnyPlanElement | null;
  selectedCount: number;
  elementTypes: ElementType[];
  updateElement: (id: string, updates: Partial<AnyPlanElement>) => void;
}

/**
 * Composant factory qui rend le bon panneau de propriétés selon le type
 */
const PropertiesFactoryComponent: React.FC<PropertiesFactoryProps> = ({
  panelType,
  selectedElement,
  selectedCount,
  elementTypes,
  updateElement
}) => {
  // Cas où aucun élément n'est sélectionné
  if (panelType === 'none') {
    return <NoSelectionPanel />;
  }
  
  // Cas où plusieurs éléments sont sélectionnés
  if (panelType === 'multiple') {
    return (
      <MultiSelectionPanel 
        selectedCount={selectedCount} 
        elementTypes={elementTypes} 
      />
    );
  }
  
  // Cas où un seul élément est sélectionné, mais il n'existe pas
  if (!selectedElement) {
    return <NoSelectionPanel />;
  }
  
  // Rendu des panneaux selon le type d'élément
  switch (panelType) {
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
      // Panneau par défaut pour les types non gérés
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

export default PropertiesFactoryComponent;