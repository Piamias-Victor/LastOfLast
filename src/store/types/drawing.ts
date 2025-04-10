// src/store/types/drawing.ts (nouveau fichier)
/**
 * Types de modes de dessin possibles
 */
export type DrawingMode = 'none' | 'wall';

/**
 * Propriétés d'état du mode dessin
 */
export interface DrawingStateProps {
  /** Mode de dessin actuel */
  drawingMode: DrawingMode;
  
  /** Point de départ du dessin en cours (mur, etc.) */
  drawingStartPoint: { x: number; y: number } | null;
}

/**
 * Actions disponibles pour le mode dessin
 */
export interface DrawingStateActions {
  /** Définit le mode de dessin */
  setDrawingMode: (mode: DrawingMode) => void;
  
  /** Définit le point de départ du dessin */
  setDrawingStartPoint: (point: { x: number; y: number } | null) => void;
}

/**
 * Type complet de l'état du mode dessin (props + actions)
 */
export type DrawingState = DrawingStateProps & DrawingStateActions;