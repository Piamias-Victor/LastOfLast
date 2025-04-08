import { AnyPlanElement } from '@/types/elements';

/**
 * Options pour le dessin d'un rectangle
 */
export interface RectangleDrawOptions {
  /** Appliquer une rotation */
  applyRotation?: boolean;
  /** Dessiner les coins arrondis */
  applyCornerRadius?: boolean;
  /** Dessiner la bordure */
  applyBorder?: boolean;
}

/**
 * Options pour le dessin d'un indicateur de sélection
 */
export interface SelectionIndicatorOptions {
  /** Taille de la marge autour de l'élément sélectionné */
  padding?: number;
  /** Taille des poignées de redimensionnement */
  handleSize?: number;
  /** Épaisseur de la ligne de sélection */
  lineWidth?: number;
  /** Motif de ligne pointillée */
  lineDash?: number[];
}

/**
 * Contexte de dessin avec état sauvegardé
 */
export interface DrawingContextState {
  /** Sauvegarder l'état du contexte */
  save: () => void;
  /** Restaurer l'état du contexte */
  restore: () => void;
  /** Appliquer une transformation */
  transform: (element: AnyPlanElement) => void;
}

/**
 * Options pour le dessin des éléments
 */
export interface DrawElementsOptions {
  /** Trier les éléments par zIndex */
  sortByZIndex?: boolean;
  /** Appliquer des transformations */
  applyTransforms?: boolean;
}

/**
 * Options pour le dessin d'une grille
 */
export interface GridDrawOptions {
  /** Couleur de la grille */
  color?: string;
  /** Épaisseur des lignes */
  lineWidth?: number;
  /** Dimensions du canvas */
  canvasWidth: number;
  /** Hauteur du canvas */
  canvasHeight: number;
  /** Taille de la grille */
  gridSize: number;
}