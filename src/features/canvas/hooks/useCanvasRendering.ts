'use client';

import { useEffect } from 'react';
import { DEFAULT_EDITOR_CONFIG, EDITOR_COLORS } from '@/lib/constants/editor';
import { AnyPlanElement } from '@/types/elements';
import { drawMultiSelectionBox } from '@/features/drawing';
import { Vector2D } from '@/types/geometry';
import { SelectionBox } from '../types';
import { drawElements } from '@/features/drawing/utils/drawElements';

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
  // Dessiner le canvas et la grille
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Effacer le canvas
    context.clearRect(0, 0, width, height);

    // Appliquer le zoom et l'offset
    context.save();
    context.translate(viewportOffset.x, viewportOffset.y);
    context.scale(zoom, zoom);

    // Dessiner le fond du canvas
    context.fillStyle = '#ffffff';
    context.fillRect(
      0,
      0,
      DEFAULT_EDITOR_CONFIG.canvasSize.width,
      DEFAULT_EDITOR_CONFIG.canvasSize.height
    );

    // Dessiner la bordure du canvas
    context.strokeStyle = '#e0e0e0';
    context.lineWidth = 1;
    context.strokeRect(
      0,
      0,
      DEFAULT_EDITOR_CONFIG.canvasSize.width,
      DEFAULT_EDITOR_CONFIG.canvasSize.height
    );

    // Dessiner la grille si activée
    if (gridEnabled) {
      context.beginPath();
      context.strokeStyle = EDITOR_COLORS.grid;
      context.lineWidth = 1;

      // Lignes verticales
      for (let x = 0; x <= DEFAULT_EDITOR_CONFIG.canvasSize.width; x += gridSize) {
        context.moveTo(x, 0);
        context.lineTo(x, DEFAULT_EDITOR_CONFIG.canvasSize.height);
      }

      // Lignes horizontales
      for (let y = 0; y <= DEFAULT_EDITOR_CONFIG.canvasSize.height; y += gridSize) {
        context.moveTo(0, y);
        context.lineTo(DEFAULT_EDITOR_CONFIG.canvasSize.width, y);
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
    width,
    height,
    gridEnabled,
    gridSize,
    zoom,
    viewportOffset,
    elements,
    selectedElementIds,
    selectionBox
  ]);
}