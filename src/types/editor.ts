
/**
 * Configuration de l'éditeur
 */
export interface EditorConfig {
  /** Taille du canvas en pixels */
  canvasSize: { width: number; height: number };
  /** Taille de la grille en pixels */
  gridSize: number;
  /** Activer/désactiver la grille */
  showGrid: boolean;
  /** Activer/désactiver l'alignement sur la grille */
  snapToGrid: boolean;
  /** Zoom minimum */
  minZoom: number;
  /** Zoom maximum */
  maxZoom: number;
  /** Zoom par défaut */
  defaultZoom: number;
}

/**
 * État de l'historique des actions
 */
export interface HistoryState {
  /** États passés */
  past: EditorState[];
  /** État présent */
  present: EditorState;
  /** États futurs (après avoir utilisé undo) */
  future: EditorState[];
}

/**
 * État de l'éditeur (référencé seulement pour HistoryState)
 */
import { EditorState } from '@/states/editorStore';