// src/features/canvas/components/Canvas.tsx (modification)
import React from 'react';
import CanvasContainer from './CanvasContainer';
import { useCanvasSetup } from '../hooks/useCanvasSetup';
import { useEditorStore } from '@/store';

interface CanvasProps {
  width?: number;
  height?: number;
}

/**
 * Composant principal du canvas (point d'entrée simplifié)
 */
const Canvas: React.FC<CanvasProps> = ({ width, height }) => {
  // Initialiser le canvas avec les éléments par défaut
  useCanvasSetup();
  
  // Récupérer les dimensions du canvas depuis le store
  const { canvasDimensions } = useEditorStore();
  
  // Utiliser les dimensions du store si elles ne sont pas fournies en props
  const canvasWidth = width || canvasDimensions.width;
  const canvasHeight = height || canvasDimensions.height;

  return <CanvasContainer width={canvasWidth} height={canvasHeight} />;
};

export default Canvas;