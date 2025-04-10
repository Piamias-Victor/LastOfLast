// src/store/types/index.ts (modification)
import { EditorState } from './editor';
import { ElementsState } from './elements';
import { OperationsState } from './operations';
import { ClipboardState } from './clipboard';
import { DrawingState } from './drawing';

/**
 * Type complet de l'état global de l'application
 */
export type RootState = EditorState & ElementsState & OperationsState & ClipboardState & DrawingState;

// Re-export des types spécifiques
export * from './editor';
export * from './elements';
export * from './operations';
export * from './clipboard';
export * from './drawing';