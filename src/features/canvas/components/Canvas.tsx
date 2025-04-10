import React from 'react';
import CanvasContainer from './CanvasContainer';
import { useCanvasSetup } from '../hooks/useCanvasSetup';

interface CanvasProps {
  width?: number;
  height?: number;
}

/**
 * Composant principal du canvas (point d'entrée simplifié)
 */
const Canvas: React.FC<CanvasProps> = () => {
  // Initialiser le canvas avec les éléments par défaut
  useCanvasSetup();

  return <CanvasContainer />;
};

export default Canvas;