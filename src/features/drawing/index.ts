// Fonctions de dessin de rectangles
export { drawRectangle, drawRoundedRectangle } from './utils/rectangleDrawing';

// Fonctions de dessin de sélection
export { 
  drawSelectionIndicator, 
  drawResizeHandles, 
  drawMultiSelectionBox 
} from './utils/selectionDrawing';

// Fonctions de dessin de grille
export { 
  drawGrid, 
  drawCanvasBackground 
} from './utils/gridDrawing';

// Fonction de dessin d'éléments
export { drawElements } from './utils/drawElements';

// Utilitaires de contexte de dessin
export { createDrawingContext } from './utils/drawingContext';

// Types
export type {
  RectangleDrawOptions,
  SelectionIndicatorOptions,
  DrawingContextState,
  DrawElementsOptions,
  GridDrawOptions
} from './types';