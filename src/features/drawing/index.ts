// Fonctions de dessin de rectangles
export { drawRectangle, drawRoundedRectangle } from './utils/rectangleDrawing';

// Fonctions de dessin de comptoirs
export { drawCounter } from './utils/counterDrawing';

// Fonctions de dessin de gondoles
export { drawGondola } from './utils/gondolaDrawing';

// Fonctions de dessin de têtes de gondole
export { drawEndCap } from './utils/endcapDrawing';

// Fonctions de dessin de bacs soldeurs
export { drawBargainBin } from './utils/bargainBinDrawing';

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