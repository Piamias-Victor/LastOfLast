import { create } from 'zustand';
import { RootState } from './types';
import { createEditorSlice } from './slices/editorSlice';
import { createElementsSlice } from './slices/elementsSlice';
import { createOperationsSlice } from './slices/operationsSlice';

/**
 * Store Zustand pour l'éditeur, combinant tous les slices
 */
export const useEditorStore = create<RootState>()((...a) => ({
  ...createEditorSlice(...a),
  ...createElementsSlice(...a),
  ...createOperationsSlice(...a),
}));

// Exporter les sélecteurs pour accéder à l'état
export * from './selectors/editorSelectors';
export * from './selectors/elementsSelectors';
export * from './selectors/operationsSelectors';

// Exporter les types
export * from './types';