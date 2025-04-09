import { AnyPlanElement } from '@/types/elements';

/**
 * Propriétés d'état du presse-papier
 */
export interface ClipboardStateProps {
  /** Éléments copiés dans le presse-papier */
  copiedElements: AnyPlanElement[];
}

/**
 * Actions disponibles pour le presse-papier
 */
export interface ClipboardStateActions {
  /** Copie les éléments sélectionnés dans le presse-papier */
  copySelectedElements: () => void;
  
  /** Colle les éléments du presse-papier */
  pasteElements: () => void;
  
  /** Coupe les éléments sélectionnés (copie + suppression) */
  cutSelectedElements: () => void;
}

/**
 * Type complet de l'état du presse-papier (props + actions)
 */
export type ClipboardState = ClipboardStateProps & ClipboardStateActions;