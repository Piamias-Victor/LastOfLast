// Exporter les constantes et types
export { 
  ALIGNMENT_THRESHOLD,
  getElementAlignmentPoints,
  isClose
} from './core/alignmentConstants';

// Exporter les fonctions d'alignement horizontal
export { alignElementsHorizontally } from './core/horizontalAlignment';

// Exporter les fonctions d'alignement vertical
export { alignElementsVertically } from './core/verticalAlignment';

// Exporter les fonctions de distribution
export { 
  distributeHorizontally, 
  distributeVertically 
} from './core/distributionUtils';

// Exporter les fonctions de guides d'alignement
export { 
  detectAlignmentGuides, 
  snapToGuides 
} from './core/alignmentGuides';