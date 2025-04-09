import { create } from 'zustand';
import { RootState } from './types';
import { createEditorSlice } from './slices/editorSlice';
import { createElementsSlice } from './slices/elementsSlice';
import { createOperationsSlice } from './slices/operationsSlice';
import { createClipboardSlice } from './slices/clipboardSlice';

/**
 * Store Zustand pour l'éditeur, combinant tous les slices
 */
export const useEditorStore = create<RootState>()((...a) => ({
  ...createEditorSlice(...a),
  ...createElementsSlice(...a),
  ...createOperationsSlice(...a),
  ...createClipboardSlice(...a),
}));

// Exporter les sélecteurs pour accéder à l'état
export * from './selectors/editorSelectors';
export * from './selectors/elementsSelectors';
export * from './selectors/operationsSelectors';
export * from './selectors/clipboardSelectors';

// Exporter les types
export * from './types';