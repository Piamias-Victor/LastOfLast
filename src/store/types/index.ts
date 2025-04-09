import { EditorState } from './editor';
import { ElementsState } from './elements';
import { OperationsState } from './operations';
import { ClipboardState } from './clipboard';

/**
 * Type complet de l'état global de l'application
 */
export type RootState = EditorState & ElementsState & OperationsState & ClipboardState;

// Re-export des types spécifiques
export * from './editor';
export * from './elements';
export * from './operations';
export * from './clipboard';