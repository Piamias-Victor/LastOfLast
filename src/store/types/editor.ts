import { Vector2D } from '@/types/geometry';

/**
 * Propriétés de configuration de l'éditeur
 */
export interface EditorStateProps {
  /** Mode grille activé */
  gridEnabled: boolean;
  
  /** Taille de la grille en pixels */
  gridSize: number;
  
  /** Zoom actuel */
  zoom: number;
  
  /** Décalage du viewport */
  viewportOffset: Vector2D;
  
  /** L'élément est-il magnétisé à la grille */
  snapToGrid: boolean;
}

/**
 * Actions disponibles pour l'état de l'éditeur
 */
export interface EditorStateActions {
  /** Active/désactive la grille */
  toggleGrid: () => void;
  
  /** Active/désactive l'alignement sur la grille */
  toggleSnapToGrid: () => void;
  
  /** Définit le niveau de zoom */
  setZoom: (zoom: number) => void;
  
  /** Définit le décalage du viewport */
  setViewportOffset: (offset: Vector2D) => void;
}

/**
 * Type complet de l'état de l'éditeur (props + actions)
 */
export type EditorState = EditorStateProps & EditorStateActions;