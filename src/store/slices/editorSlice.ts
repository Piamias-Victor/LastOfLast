import { StateCreator } from 'zustand';
import { produce } from 'immer';
import { RootState } from '../types';
import { EditorState } from '../types/editor';
import { Vector2D } from '@/types/geometry';

/**
 * Valeurs initiales pour l'état de l'éditeur
 */
export const initialEditorState: EditorState = {
  gridEnabled: true,
  gridSize: 20,
  zoom: 1,
  viewportOffset: { x: 0, y: 0 },
  snapToGrid: true,
  
  // Actions sont définies dans la création du slice
  toggleGrid: () => {},
  toggleSnapToGrid: () => {},
  setZoom: () => {},
  setViewportOffset: () => {}
};

/**
 * Créateur de slice pour l'état de l'éditeur
 */
export const createEditorSlice: StateCreator<RootState, [], [], EditorState> = (set) => ({
  ...initialEditorState,
  
  toggleGrid: () =>
    set(
      produce((state: RootState) => {
        state.gridEnabled = !state.gridEnabled;
      })
    ),
    
  toggleSnapToGrid: () =>
    set(
      produce((state: RootState) => {
        state.snapToGrid = !state.snapToGrid;
      })
    ),
    
  setZoom: (zoom: number) =>
    set(
      produce((state: RootState) => {
        state.zoom = zoom;
      })
    ),
    
  setViewportOffset: (offset: Vector2D) =>
    set(
      produce((state: RootState) => {
        state.viewportOffset = offset;
      })
    ),
});