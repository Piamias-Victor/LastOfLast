// Exportation des composants
export { default as AlignmentGuides } from './components/AlignmentGuides';
export { default as AlignmentTools } from './components/AlignmentTools';

// Exportation des hooks
export { useAlignment } from './hooks/useAlignment';

// Exportation des types
export {
  HorizontalAlignment,
  VerticalAlignment,
  AlignmentGuide,
  AlignmentResult,
  AlignmentContext
} from './types';

// Exportation des utilitaires
export {
  alignElementsHorizontally,
  alignElementsVertically,
  distributeHorizontally,
  distributeVertically,
  detectAlignmentGuides,
  snapToGuides,
  ALIGNMENT_THRESHOLD
} from './utils/alignmentUtils';