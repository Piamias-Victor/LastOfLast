import React, { useRef } from 'react';
import { useCanvasInteraction } from '@/features/canvas/hooks/useCanvasInteraction';
import { useCanvasZoom } from '@/features/canvas/hooks/useCanvasZoom';
import { useCanvasRendering } from '@/features/canvas/hooks/useCanvasRendering';
import { useCanvasDrop } from '@/features/canvas/hooks/useCanvasDrop';
import { useAlignment } from '@/features/alignment';
import { AlignmentGuides } from '@/features/alignment';
import { useEditorStore } from '@/store';

interface CanvasWorkspaceProps {
  width: number;
  height: number;
}

/**
 * Composant pour le canvas de travail et ses interactions
 */
const CanvasWorkspace: React.FC<CanvasWorkspaceProps> = ({ width, height }) => {
  // Correction du typage de useRef
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State du canvas depuis le store
  const {
    gridEnabled,
    gridSize,
    zoom,
    viewportOffset,
    elements,
    selectedElementIds,
    setZoom,
    setViewportOffset
  } = useEditorStore();
  
  // Hook pour les guides d'alignement
  const { activeGuides } = useAlignment();
  
  // Hooks d'interaction avec le canvas
  const { handleMouseDown, handleMouseMove, handleMouseUp, selectionBox, cursor } = 
    useCanvasInteraction({ canvasRef });
  
  const { handleWheel } = useCanvasZoom({
    zoom,
    viewportOffset,
    setZoom,
    setViewportOffset,
    canvasRef
  });
  
  const { handleDragOver, handleDrop } = useCanvasDrop(canvasRef);
  
  // Rendu du canvas
  useCanvasRendering({
    canvasRef,
    width,
    height,
    gridEnabled,
    gridSize,
    zoom,
    viewportOffset,
    elements,
    selectedElementIds,
    selectionBox
  });

  return (
    <>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="bg-gray-100"
        style={{ display: 'block', cursor }}
      />
      
      {/* Guides d'alignement */}
      <AlignmentGuides
        guides={activeGuides}
        canvasWidth={width}
        canvasHeight={height}
        zoom={zoom}
        viewportOffset={viewportOffset}
      />
    </>
  );
};

export default CanvasWorkspace;