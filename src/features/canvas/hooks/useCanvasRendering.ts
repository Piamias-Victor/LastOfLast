'use client';

import { useEffect, useCallback } from 'react';
import { EDITOR_COLORS } from '@/lib/constants/editor';
import { AnyPlanElement } from '@/types/elements';
import { drawMultiSelectionBox } from '@/features/drawing';
import { Vector2D } from '@/types/geometry';
import { SelectionBox } from '../types';
import { drawElements } from '@/features/drawing/utils/drawElements';
import { useEditorStore } from '@/store';

interface UseCanvasRenderingProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  width: number;
  height: number;
  gridEnabled: boolean;
  gridSize: number;
  zoom: number;
  viewportOffset: Vector2D;
  elements: AnyPlanElement[];
  selectedElementIds: string[];
  selectionBox: SelectionBox;
}

/**
 * Hook pour gérer le rendu du canvas
 */
export function useCanvasRendering({
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
}: UseCanvasRenderingProps): void {
  // Accéder au mode de dessin
  const { drawingMode, drawingStartPoint, canvasDimensions } = useEditorStore();

  // Définition claire des deux concepts de dimensions
  const viewportWidth = width; // Dimensions de la zone visible (l'élément canvas réel)
  const viewportHeight = height;
  
  const documentWidth = canvasDimensions?.width || 1200; // Dimensions du document (le plan blanc)
  const documentHeight = canvasDimensions?.height || 900;

  // Fonction de rendu optimisée
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Effacer tout le canvas (toute la zone visible)
    context.clearRect(0, 0, viewportWidth, viewportHeight);
    
    // Dessiner un fond pour la zone du viewport
    context.fillStyle = '#f5f5f5'; // Fond gris clair pour le viewport
    context.fillRect(0, 0, viewportWidth, viewportHeight);

    // Appliquer le zoom et l'offset
    context.save();
    context.translate(viewportOffset.x, viewportOffset.y);
    context.scale(zoom, zoom);

    // Dessiner le plan de pharmacie (rectangle blanc)
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, documentWidth, documentHeight);

    // Dessiner la bordure du plan
    context.strokeStyle = '#e0e0e0';
    context.lineWidth = 1 / zoom; // Ajuster l'épaisseur de la ligne en fonction du zoom
    context.strokeRect(0, 0, documentWidth, documentHeight);

    // Dessiner la grille si activée
    if (gridEnabled) {
      context.beginPath();
      context.strokeStyle = EDITOR_COLORS.grid;
      context.lineWidth = 0.5 / zoom; // Ajuster l'épaisseur de la ligne en fonction du zoom
      
      // Lignes verticales
      for (let x = 0; x <= documentWidth; x += gridSize) {
        context.moveTo(x, 0);
        context.lineTo(x, documentHeight);
      }

      // Lignes horizontales
      for (let y = 0; y <= documentHeight; y += gridSize) {
        context.moveTo(0, y);
        context.lineTo(documentWidth, y);
      }

      context.stroke();
    }

    // Dessiner les éléments
    drawElements(context, elements, selectedElementIds);
    
    // Dessiner le rectangle de sélection s'il est en cours
    if (selectionBox.start && selectionBox.end) {
      drawMultiSelectionBox(context, selectionBox.start, selectionBox.end);
    }

    // Restaurer le contexte
    context.restore();
  }, [
    viewportWidth,
    viewportHeight,
    documentWidth,
    documentHeight,
    gridEnabled,
    gridSize,
    zoom,
    viewportOffset,
    elements,
    selectedElementIds,
    selectionBox,
    canvasRef
  ]);

  // Dessiner le canvas et la grille
  useEffect(() => {
    renderCanvas();
    
    // Configurer un événement pour le rendu forcé
    const handleForceRender = () => {
      renderCanvas();
    };
    
    window.addEventListener('forcerender', handleForceRender);
    
    return () => {
      window.removeEventListener('forcerender', handleForceRender);
    };
  }, [renderCanvas]);
}