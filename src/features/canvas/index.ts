// Hooks
export { useCanvasInteraction } from './hooks/useCanvasInteraction';
export { useCoordinateConversion } from './hooks/useCoordinateConversion';
export { useElementDetection } from './hooks/useElementDetection';
export { useElementOperation } from './hooks/useElementOperation';
export { useSelectionBox } from './hooks/useSelectionBox';

// Types
export type {
  CanvasInteractionResult,
  CoordinateConversionResult,
  ElementDetectionResult,
  ElementOperationResult,
  SelectionBox,
  SelectionBoxResult,
  UseCanvasInteractionProps
} from './types';

// Utils
export { calculateResizeValues, normalizeResizeValues, applyGridToResizeValues } from './utils/resizeUtils';
export { determineOperation } from './utils/operationUtils';
export { useCursor } from './utils/cursorUtils';