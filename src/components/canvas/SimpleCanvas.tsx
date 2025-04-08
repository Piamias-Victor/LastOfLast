'use client';

import React, { useRef, useEffect } from 'react';
import { useEditorStore } from '@/states/editorStore';
import { DEFAULT_EDITOR_CONFIG, EDITOR_COLORS } from '@/lib/constants/editor';
import { drawElements, drawMultiSelectionBox } from '@/lib/canvas/drawUtils';
import { ElementType, RectangleElement } from '@/types/elements';
import { useCanvasInteraction } from '@/hooks/useCanvasInteraction';

interface SimpleCanvasProps {
  width: number;
  height: number;
}

const SimpleCanvas: React.FC<SimpleCanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { 
    gridEnabled, 
    gridSize, 
    zoom, 
    viewportOffset, 
    setZoom, 
    setViewportOffset,
    elements,
    selectedElementIds,
    addElement,
  } = useEditorStore();
  
  // Utiliser notre hook d'interaction qui nous retourne aussi le curseur
  const { handleMouseDown, handleMouseMove, handleMouseUp, selectionBox, cursor } = useCanvasInteraction(canvasRef);

  // Ajouter un rectangle statique au chargement initial
  useEffect(() => {
    if (elements.length === 0) {
      // Ajouter un rectangle au centre du canvas
      const centerX = DEFAULT_EDITOR_CONFIG.canvasSize.width / 2 - 100;
      const centerY = DEFAULT_EDITOR_CONFIG.canvasSize.height / 2 - 60;
      
      addElement({
        type: ElementType.RECTANGLE,
        bounds: {
          x: centerX,
          y: centerY,
          width: 200,
          height: 120,
        },
        transform: {
          position: { x: centerX, y: centerY },
          rotation: 0,
          scale: { x: 1, y: 1 },
        },
        zIndex: 1,
        isLocked: false,
        isVisible: true,
        isSelected: false,
        metadata: {
          name: 'Rectangle de test',
          customProperties: {},
        },
        backgroundColor: '#66a5ad',
        borderColor: '#0a5b91',
        borderWidth: 2,
        cornerRadius: 10,
      } as Omit<RectangleElement, 'id'>);
    }
  }, [addElement, elements.length]);

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
  }, [width, height, gridEnabled, gridSize, zoom, viewportOffset, elements, selectedElementIds, selectionBox]);

  // Gestion du zoom avec la molette
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    const scaleBy = 1.1;
    const oldZoom = zoom;

    // Calcul du point sous la souris en coordonnées canvas
    const rect = canvasRef.current!.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Point sous la souris en coordonnées du monde
    const worldX = (mouseX - viewportOffset.x) / oldZoom;
    const worldY = (mouseY - viewportOffset.y) / oldZoom;

    // Calcul du nouveau zoom
    const newZoom = e.deltaY < 0 ? oldZoom * scaleBy : oldZoom / scaleBy;
    const limitedZoom = Math.max(
      DEFAULT_EDITOR_CONFIG.minZoom,
      Math.min(DEFAULT_EDITOR_CONFIG.maxZoom, newZoom)
    );

    // Calcul du nouvel offset pour garder le point sous la souris au même endroit
    const newOffsetX = mouseX - worldX * limitedZoom;
    const newOffsetY = mouseY - worldY * limitedZoom;

    // Mise à jour du zoom et de l'offset
    setZoom(limitedZoom);
    setViewportOffset({ x: newOffsetX, y: newOffsetY });
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="bg-gray-100"
      style={{ display: 'block', cursor }}
    />
  );
};

export default SimpleCanvas;