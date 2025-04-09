'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useCanvasInteraction } from '@/features/canvas/hooks/useCanvasInteraction';
import { useCanvasZoom } from '@/features/canvas/hooks/useCanvasZoom';
import { useCanvasRendering } from '@/features/canvas/hooks/useCanvasRendering';
import { useCanvasSetup } from '@/features/canvas/hooks/useCanvasSetup';
import { useCanvasDrop } from '@/features/canvas/hooks/useCanvasDrop';
import { useToast } from '@/hooks/useToast';
import { useAlignment } from '@/features/alignment';
import { AlignmentGuides, AlignmentTools } from '@/features/alignment';
import CanvasTools from './CanvasTools';
import CanvasFooter from './CanvasFooter';
import { useEditorStore } from '@/store';
import Toast from '@/components/ui/Toast';
import { HorizontalAlignment, VerticalAlignment } from '@/features/alignment';

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
  const [toast, setToast] = useState<{ message: string, type: 'info' | 'success' | 'warning' | 'error' } | null>(null);
  
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
    removeSelectedElements,
    copySelectedElements,
    pasteElements,
    cutSelectedElements,
    zoom,
    viewportOffset,
    setZoom,
    setViewportOffset
  } = useEditorStore();
  
  // Hooks pour l'alignement
  const {
    activeGuides,
    alignHorizontally,
    alignVertically,
    distributeElementsHorizontally,
    distributeElementsVertically
  } = useAlignment();

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
      // Éviter d'intercepter les raccourcis clavier quand un élément d'entrée est actif
      if (
        document.activeElement &&
        (document.activeElement.tagName === 'INPUT' ||
          document.activeElement.tagName === 'TEXTAREA')
      ) {
        return;
      }
      
      // Échap pour désélectionner tout
      if (e.key === 'Escape') {
        deselectAll();
      }
      
      // Copier avec Ctrl+C ou Cmd+C
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedElementIds.length > 0) {
        copySelectedElements();
        setToast({
          message: `${selectedElementIds.length} élément(s) copié(s)`,
          type: 'success'
        });
        e.preventDefault();
      }
      
      // Coller avec Ctrl+V ou Cmd+V
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        pasteElements();
        setToast({
          message: 'Éléments collés',
          type: 'success'
        });
        e.preventDefault();
      }
      
      // Couper avec Ctrl+X ou Cmd+X
      if ((e.ctrlKey || e.metaKey) && e.key === 'x' && selectedElementIds.length > 0) {
        cutSelectedElements();
        setToast({
          message: `${selectedElementIds.length} élément(s) coupé(s)`,
          type: 'success'
        });
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [deselectAll, selectedElementIds, copySelectedElements, pasteElements, cutSelectedElements]);

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
  
  // Hook pour gérer le drag & drop
  const { handleDragOver, handleDrop } = useCanvasDrop(canvasRef);

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

  // Gestionnaires pour les actions avec feedback
  const handleCopy = () => {
    copySelectedElements();
    setToast({
      message: `${selectedElementIds.length} élément(s) copié(s)`,
      type: 'success'
    });
  };
  
  const handlePaste = () => {
    pasteElements();
    setToast({
      message: 'Éléments collés',
      type: 'success'
    });
  };
  
  const handleCut = () => {
    cutSelectedElements();
    setToast({
      message: `${selectedElementIds.length} élément(s) coupé(s)`,
      type: 'success'
    });
  };
  
  const handleDelete = () => {
    const count = selectedElementIds.length;
    removeSelectedElements();
    setToast({
      message: `${count} élément(s) supprimé(s)`,
      type: 'info'
    });
  };
  
  // Gestionnaires pour l'alignement
  const handleAlignHorizontally = (alignment: HorizontalAlignment) => {
    alignHorizontally(alignment);
    setToast({
      message: `Alignement horizontal appliqué`,
      type: 'success'
    });
  };
  
  const handleAlignVertically = (alignment: VerticalAlignment) => {
    alignVertically(alignment);
    setToast({
      message: `Alignement vertical appliqué`,
      type: 'success'
    });
  };
  
  const handleDistributeHorizontally = () => {
    distributeElementsHorizontally();
    setToast({
      message: `Distribution horizontale appliquée`,
      type: 'success'
    });
  };
  
  const handleDistributeVertically = () => {
    distributeElementsVertically();
    setToast({
      message: `Distribution verticale appliquée`,
      type: 'success'
    });
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* Barre d'outils principale */}
      <CanvasTools
        gridEnabled={gridEnabled}
        toggleGrid={toggleGrid}
        snapToGrid={snapToGrid}
        toggleSnapToGrid={toggleSnapToGrid}
        elementsCount={elements.length}
        selectedCount={selectedElementIds.length}
        onDeselectAll={deselectAll}
        onDeleteSelected={handleDelete}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onCut={handleCut}
      />
      
      {/* Barre d'outils d'alignement */}
      <AlignmentTools
        onAlignHorizontally={handleAlignHorizontally}
        onAlignVertically={handleAlignVertically}
        onDistributeHorizontally={handleDistributeHorizontally}
        onDistributeVertically={handleDistributeVertically}
        disabled={selectedElementIds.length <= 1}
      />
      
      {/* Conteneur du canvas */}
      <div ref={containerRef} className="flex-grow overflow-hidden bg-gray-50 relative">
        {canvasWidth > 0 && canvasHeight > 0 && (
          <>
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
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
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              zoom={zoom}
              viewportOffset={viewportOffset}
            />
          </>
        )}
      </div>
      
      {/* Notification toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={2000}
          onClose={() => setToast(null)}
        />
      )}
      
      {/* Pied de page avec raccourcis */}
      <CanvasFooter />
    </div>
  );
};

export default Canvas;