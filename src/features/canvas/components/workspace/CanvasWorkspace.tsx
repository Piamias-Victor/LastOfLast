import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useCanvasInteraction } from '@/features/canvas/hooks/useCanvasInteraction';
import { useCanvasZoom } from '@/features/canvas/hooks/useCanvasZoom';
import { useCanvasRendering } from '@/features/canvas/hooks/useCanvasRendering';
import { useCanvasDrop } from '@/features/canvas/hooks/useCanvasDrop';
import { useAlignment } from '@/features/alignment';
import { AlignmentGuides } from '@/features/alignment';
import { useEditorStore } from '@/store';
import { useActiveDrawing } from '@/features/canvas/hooks/useActiveDrawing';
import { usePreviewCleanup } from '../../hooks/setup/usePreviewCleanup';
import { useCanvasPan } from '../../hooks/useCanvasPan';
import { useCanvasKeyboardNavigation } from '../../hooks/useCanvasKeyboardNavigation';
import { Vector2D } from '@/types/geometry';

interface CanvasWorkspaceProps {
  width: number;
  height: number;
}

/**
 * Composant pour le canvas de travail et ses interactions
 */
const CanvasWorkspace: React.FC<CanvasWorkspaceProps> = ({ width, height }) => {
  // Référence du canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // État local pour suivre si la touche espace est enfoncée
  const [isSpaceDown, setIsSpaceDown] = useState(false);

  usePreviewCleanup(canvasRef);
  
  // State du canvas depuis le store
  const {
    gridEnabled,
    gridSize,
    zoom,
    viewportOffset,
    elements,
    selectedElementIds,
    setZoom,
    setViewportOffset,
    drawingMode,
    canvasDimensions,
    currentOperation
  } = useEditorStore();
  
  // Hook pour les guides d'alignement
  const { activeGuides } = useAlignment();
  
  // Hook pour le dessin actif
  const { updateDrawing } = useActiveDrawing(canvasRef);
  
  // Hook pour le déplacement du canvas
  const { isPanning, startPan, updatePan, endPan, handlePanKeyboard } = useCanvasPan();
  
  // Hook pour la navigation clavier
  useCanvasKeyboardNavigation({
    handlePanKeyboard,
    isActive: true // Toujours actif pour le debugging
  });
  
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
  
  // Rendu du canvas - utiliser les dimensions du conteneur, PAS les dimensions du document
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

  // Gestionnaire pour les événements de pression de touche
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        setIsSpaceDown(true);
        
        // Changer le curseur quand l'espace est enfoncé
        if (canvasRef.current) {
          canvasRef.current.style.cursor = 'grab';
        }
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpaceDown(false);
        
        // Restaurer le curseur lorsque l'espace est relâché
        if (canvasRef.current) {
          canvasRef.current.style.cursor = '';
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Gestionnaire personnalisé pour la souris (pan)
  const handleMouseDownCustom = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    // Si c'est le bouton du milieu ou le bouton gauche avec la touche Espace enfoncée
    if (e.button === 1 || (e.button === 0 && isSpaceDown)) {
      e.preventDefault();
      
      // Mettre à jour le curseur
      document.body.style.cursor = 'grabbing';
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'grabbing';
      }
      
      // Démarrer le pan
      startPan({ x: e.clientX, y: e.clientY });
      return;
    }
    
    // Sinon, déléguer au gestionnaire habituel
    handleMouseDown(e);
  }, [handleMouseDown, startPan, isSpaceDown]);

  const handleMouseMoveCustom = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      // Mettre à jour le pan
      updatePan({ x: e.clientX, y: e.clientY });
    } else {
      // Déléguer au gestionnaire habituel
      handleMouseMove(e);
    }
  }, [isPanning, updatePan, handleMouseMove]);

  const handleMouseUpCustom = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      // Restaurer le curseur
      document.body.style.cursor = '';
      if (canvasRef.current) {
        canvasRef.current.style.cursor = isSpaceDown ? 'grab' : '';
      }
      
      // Terminer le pan
      endPan();
    } else {
      // Déléguer au gestionnaire habituel
      handleMouseUp(e);
    }
  }, [isPanning, endPan, handleMouseUp, isSpaceDown]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={width} // Dimensions du viewport, PAS les dimensions du document
        height={height}
        onWheel={handleWheel}
        onMouseDown={handleMouseDownCustom}
        onMouseMove={handleMouseMoveCustom}
        onMouseUp={handleMouseUpCustom}
        onMouseLeave={handleMouseUpCustom}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="bg-gray-100"
        style={{ 
          display: 'block', 
          cursor: isPanning ? 'grabbing' : (isSpaceDown ? 'grab' : (drawingMode === 'wall' ? 'crosshair' : cursor)),
          userSelect: 'none' // Empêche la sélection de texte pendant le pan
        }}
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