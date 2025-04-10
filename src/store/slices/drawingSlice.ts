// src/store/slices/drawingSlice.ts (nouveau fichier)
import { StateCreator } from 'zustand';
import { produce } from 'immer';
import { RootState } from '../types';
import { DrawingState, DrawingMode } from '../types/drawing';

/**
 * Valeurs initiales pour l'état du mode dessin
 */
export const initialDrawingState: DrawingState = {
  drawingMode: 'none',
  drawingStartPoint: null,
  
  // Actions sont définies dans la création du slice
  setDrawingMode: () => {},
  setDrawingStartPoint: () => {},
};

/**
 * Créateur de slice pour l'état du mode dessin
 */
export const createDrawingSlice: StateCreator<RootState, [], [], DrawingState> = (set) => ({
  ...initialDrawingState,

  setDrawingMode: (mode: DrawingMode) =>
    set(
      produce((state: RootState) => {
        state.drawingMode = mode;
        state.drawingStartPoint = null; // Réinitialiser le point de départ
      })
    ),
    
  setDrawingStartPoint: (point) =>
    set(
      produce((state: RootState) => {
        state.drawingStartPoint = point;
      })
    ),
});