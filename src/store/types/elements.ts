import { AnyPlanElement, BasePlanElement } from '@/types/elements';

/**
 * Propriétés d'état des éléments
 */
export interface ElementsStateProps {
  /** Les éléments actuellement dans le plan */
  elements: AnyPlanElement[];
  
  /** IDs des éléments sélectionnés */
  selectedElementIds: string[];
}

/**
 * Actions disponibles pour les éléments
 */
export interface ElementsStateActions {
  /** Ajoute un nouvel élément */
  addElement: (element: Omit<AnyPlanElement, 'id'>) => void;
  
  /** Supprime un élément par son ID */
  removeElement: (id: string) => void;
  
  /** Met à jour un élément existant */
  updateElement: (id: string, updates: Partial<BasePlanElement>) => void;
  
  /** Sélectionne un élément */
  selectElement: (id: string) => void;
  
  /** Désélectionne un élément */
  deselectElement: (id: string) => void;
  
  /** Désélectionne tous les éléments */
  deselectAll: () => void;
  
  /** Sélectionne tous les éléments */
  selectAll: () => void;
}

/**
 * Type complet de l'état des éléments (props + actions)
 */
export type ElementsState = ElementsStateProps & ElementsStateActions;