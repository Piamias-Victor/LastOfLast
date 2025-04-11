import { StateCreator } from 'zustand';
import { produce } from 'immer';
import { RootState } from '../types';
import { CanvasDimensionsState, CanvasDimensions, CanvasUnit } from '@/types/canvas';

/**
 * Valeurs initiales pour l'état des dimensions du canvas
 */
export const initialCanvasDimensionsState: CanvasDimensionsState = {
  canvasDimensions: {
    width: 1200,
    height: 900
  },
  canvasUnit: 'cm',
  pixelsPerUnit: 10, // 10 pixels par cm par défaut
  
  // Actions sont définies dans la création du slice
  setCanvasDimensions: () => {},
  setCanvasUnit: () => {},
  setPixelsPerUnit: () => {}
};

/**
 * Créateur de slice pour l'état des dimensions du canvas
 */
export const createCanvasDimensionsSlice: StateCreator<RootState, [], [], CanvasDimensionsState> = (set) => ({
  ...initialCanvasDimensionsState,

  setCanvasDimensions: (dimensions: CanvasDimensions) =>
    set(
      produce((state: RootState) => {
        state.canvasDimensions = dimensions;
      })
    ),
    
  setCanvasUnit: (unit: CanvasUnit) =>
    set(
      produce((state: RootState) => {
        state.canvasUnit = unit;
      })
    ),
    
  setPixelsPerUnit: (factor: number) =>
    set(
      produce((state: RootState) => {
        state.pixelsPerUnit = factor;
      })
    ),
});