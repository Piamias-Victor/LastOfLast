import { RootState } from '../types';

/**
 * Sélectionne les dimensions du canvas
 */
export const selectCanvasDimensions = (state: RootState) => state.canvasDimensions;

/**
 * Sélectionne la largeur du canvas
 */
export const selectCanvasWidth = (state: RootState) => state.canvasDimensions.width;

/**
 * Sélectionne la hauteur du canvas
 */
export const selectCanvasHeight = (state: RootState) => state.canvasDimensions.height;

/**
 * Sélectionne l'unité de mesure du canvas
 */
export const selectCanvasUnit = (state: RootState) => state.canvasUnit;

/**
 * Sélectionne le facteur de conversion entre pixels et unités réelles
 */
export const selectPixelsPerUnit = (state: RootState) => state.pixelsPerUnit;

/**
 * Sélectionne les dimensions réelles du canvas (en unités de mesure actuelles)
 */
export const selectRealDimensions = (state: RootState) => ({
  width: state.canvasDimensions.width / state.pixelsPerUnit,
  height: state.canvasDimensions.height / state.pixelsPerUnit
});