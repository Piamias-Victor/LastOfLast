// src/store/selectors/drawingSelectors.ts (nouveau fichier)
import { RootState } from '../types';

/**
 * Sélectionne le mode de dessin actuel
 */
export const selectDrawingMode = (state: RootState) => state.drawingMode;

/**
 * Sélectionne le point de départ du dessin
 */
export const selectDrawingStartPoint = (state: RootState) => state.drawingStartPoint;

/**
 * Vérifie si un mode de dessin est actif
 */
export const selectIsDrawingActive = (state: RootState) => state.drawingMode !== 'none';