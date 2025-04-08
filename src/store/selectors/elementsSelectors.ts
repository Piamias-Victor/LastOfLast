import { RootState } from '../types';
import { AnyPlanElement } from '@/types/elements';

/**
 * Sélectionne tous les éléments
 */
export const selectElements = (state: RootState) => state.elements;

/**
 * Sélectionne les IDs des éléments sélectionnés
 */
export const selectSelectedElementIds = (state: RootState) => state.selectedElementIds;

/**
 * Sélectionne le nombre total d'éléments
 */
export const selectElementsCount = (state: RootState) => state.elements.length;

/**
 * Sélectionne le nombre d'éléments sélectionnés
 */
export const selectSelectedElementsCount = (state: RootState) => state.selectedElementIds.length;

/**
 * Sélectionne un élément par son ID
 */
export const selectElementById = (id: string) => (state: RootState): AnyPlanElement | undefined => 
  state.elements.find(element => element.id === id);

/**
 * Sélectionne les éléments sélectionnés
 */
export const selectSelectedElements = (state: RootState): AnyPlanElement[] => 
  state.elements.filter(element => state.selectedElementIds.includes(element.id));