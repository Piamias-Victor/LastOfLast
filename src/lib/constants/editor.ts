import { EditorConfig } from '@/types/editor';

/**
 * Configuration par défaut de l'éditeur
 */
export const DEFAULT_EDITOR_CONFIG: EditorConfig = {
  canvasSize: { width: 1200, height: 900 },
  gridSize: 20,
  showGrid: true,
  snapToGrid: true,
  minZoom: 0.1,
  maxZoom: 3,
  defaultZoom: 1,
};

/**
 * Taille des poignées de redimensionnement en pixels
 */
export const RESIZE_HANDLE_SIZE = 12; // Augmenté à 12px pour faciliter la sélection

/**
 * Distance en pixels à partir de laquelle un élément est considéré comme sélectionné
 */
export const SELECTION_THRESHOLD = 5;

/**
 * Couleurs utilisées dans l'éditeur
 */
export const EDITOR_COLORS = {
  background: '#f5f5f5',
  grid: 'rgba(10, 91, 145, 0.1)',
  selection: '#0a5b91',
  selectionFill: 'rgba(10, 91, 145, 0.1)',
  resizeHandle: '#0a5b91',
  resizeHandleFill: '#ffffff',
  hoverOutline: 'rgba(10, 91, 145, 0.5)',
};