import { useMemo } from 'react';
import { ElementType, AnyPlanElement } from '@/types/elements';
import { useEditorStore } from '@/store';

/**
 * Types possibles de panneaux de propriétés
 */
export type PanelType = 'none' | 'multiple' | ElementType;

/**
 * Résultat du hook usePropertiesSelector
 */
export interface PropertiesSelectorResult {
  panelType: PanelType;
  selectedElement: AnyPlanElement | null;
  selectedCount: number;
  elementTypes: ElementType[];
}

/**
 * Hook pour déterminer quel panneau de propriétés afficher
 */
export function usePropertiesSelector(): PropertiesSelectorResult {
  const { elements, selectedElementIds } = useEditorStore();
  
  return useMemo(() => {
    // Pas d'élément sélectionné
    if (selectedElementIds.length === 0) {
      return {
        panelType: 'none',
        selectedElement: null,
        selectedCount: 0,
        elementTypes: []
      };
    }
    
    // Sélection multiple
    if (selectedElementIds.length > 1) {
      const selectedElements = elements.filter(el => selectedElementIds.includes(el.id));
      const elementTypes = Array.from(new Set(selectedElements.map(el => el.type)));
      
      return {
        panelType: 'multiple',
        selectedElement: null,
        selectedCount: selectedElementIds.length,
        elementTypes
      };
    }
    
    // Un seul élément sélectionné
    const selectedElement = elements.find(el => el.id === selectedElementIds[0]);
    
    if (!selectedElement) {
      return {
        panelType: 'none',
        selectedElement: null,
        selectedCount: 0,
        elementTypes: []
      };
    }
    
    return {
      panelType: selectedElement.type,
      selectedElement,
      selectedCount: 1,
      elementTypes: [selectedElement.type]
    };
  }, [elements, selectedElementIds]);
}