import { RootState } from '../types';

/**
 * Sélectionne l'état d'activation de la grille
 */
export const selectGridEnabled = (state: RootState) => state.gridEnabled;

/**
 * Sélectionne la taille de la grille
 */
export const selectGridSize = (state: RootState) => state.gridSize;

/**
 * Sélectionne le niveau de zoom
 */
export const selectZoom = (state: RootState) => state.zoom;

/**
 * Sélectionne le décalage du viewport
 */
export const selectViewportOffset = (state: RootState) => state.viewportOffset;

/**
 * Sélectionne l'état d'activation de l'alignement sur la grille
 */
export const selectSnapToGrid = (state: RootState) => state.snapToGrid;