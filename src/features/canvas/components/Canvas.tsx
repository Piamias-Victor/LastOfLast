'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useEditorStore } from '@/states/editorStore';
import { useCanvasInteraction } from '@/features/canvas/hooks/useCanvasInteraction';
import { useCanvasZoom } from '@/features/canvas/hooks/useCanvasZoom';
import { useCanvasRendering } from '@/features/canvas/hooks/useCanvasRendering';
import { useCanvasSetup } from '@/features/canvas/hooks/useCanvasSetup';
import CanvasTools from './CanvasTools';
import CanvasFooter from './CanvasFooter';

interface CanvasProps {
  width?: number;
  height?: number;
}

/**
 * Composant principal du canvas
 */
const Canvas: React.FC<CanvasProps> = ({ width: propWidth, height: propHeight }) => {
  // Références et états locaux
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
  // État global de l'éditeur
  const { 
    toggleGrid, 
    toggleSnapToGrid, 
    gridEnabled, 
    snapToGrid,
    gridSize,
    elements,
    selectedElementIds,
    deselectAll,
    zoom,
    viewportOffset,
    setZoom,
    setViewportOffset
  } = useEditorStore();

  // Initialiser le canvas avec un élément par défaut
  useCanvasSetup();

  // Observer les changements de taille du conteneur
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    
    // Mettre à jour la taille initiale
    updateSize();
    
    // Observer les changements de taille
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);
    
    // Variable pour éviter une fuite mémoire dans le cleanup
    const currentRef = containerRef.current;
    
    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
    };
  }, []);

  // Ajouter des raccourcis clavier pour la sélection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Échap pour désélectionner tout
      if (e.key === 'Escape') {
        deselectAll();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [deselectAll]);

  // Hooks pour la gestion du canvas
  const { handleMouseDown, handleMouseMove, handleMouseUp, selectionBox, cursor } = 
    useCanvasInteraction({ canvasRef });
  
  const { handleWheel } = useCanvasZoom({
    zoom,
    viewportOffset,
    setZoom,
    setViewportOffset,
    canvasRef
  });

  // Calculer les dimensions effectives du canvas
  const canvasWidth = propWidth ?? containerSize.width;
  const canvasHeight = propHeight ?? containerSize.height;

  // Rendu du canvas - IMPORTANT: Appeler le hook de manière inconditionnelle
  useCanvasRendering({
    canvasRef,
    width: canvasWidth || 0,  // Fournir une valeur par défaut
    height: canvasHeight || 0, // Fournir une valeur par défaut
    gridEnabled,
    gridSize,
    zoom,
    viewportOffset,
    elements,
    selectedElementIds,
    selectionBox
  });

  return (
    <div className="flex h-full w-full flex-col">
      {/* Barre d'outils */}
      <CanvasTools
        gridEnabled={gridEnabled}
        toggleGrid={toggleGrid}
        snapToGrid={snapToGrid}
        toggleSnapToGrid={toggleSnapToGrid}
        elementsCount={elements.length}
        selectedCount={selectedElementIds.length}
        onDeselectAll={deselectAll}
      />
      
      {/* Conteneur du canvas */}
      <div ref={containerRef} className="flex-grow overflow-hidden bg-gray-50">
        {canvasWidth > 0 && canvasHeight > 0 && (
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="bg-gray-100"
            style={{ display: 'block', cursor }}
          />
        )}
      </div>
      
      {/* Pied de page avec raccourcis */}
      <CanvasFooter />
    </div>
  );
};

export default Canvas;