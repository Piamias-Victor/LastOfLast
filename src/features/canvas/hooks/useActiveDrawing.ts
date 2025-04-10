// src/features/canvas/hooks/useActiveDrawing.ts
'use client';

import { useCallback, useRef } from 'react';
import { Vector2D } from '@/types/geometry';
import { useEditorStore } from '@/store';
import { useWallDrawing } from './useWallDrawing';

/**
 * Hook pour gérer le dessin actif (murs, etc.)
 */
export function useActiveDrawing(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const { drawingMode } = useEditorStore();
  const { 
    startWallDrawing, 
    updateWallDrawing,
    finishWallDrawing,
    cancelWallDrawing,
    isWallDrawingActive,
    hasWallDrawingStarted
  } = useWallDrawing();

  // Référence vers un canvas de preview
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Créer un canvas de preview si nécessaire
  const getPreviewCanvas = useCallback(() => {
    if (!canvasRef.current) return null;
    
    // Si on n'a pas encore de canvas de preview, en créer un
    if (!previewCanvasRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = canvasRef.current.width;
      canvas.height = canvasRef.current.height;
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '10';
      
      // Ajouter le canvas au DOM comme frère du canvas principal
      if (canvasRef.current.parentNode) {
        canvasRef.current.parentNode.appendChild(canvas);
      }
      
      previewCanvasRef.current = canvas;
    }
    
    return previewCanvasRef.current;
  }, [canvasRef]);

  /**
   * Commence le dessin selon le mode actif
   */
  const startDrawing = useCallback((position: Vector2D) => {
    if (isWallDrawingActive) {
      startWallDrawing(position);
      return true;
    }
    return false;
  }, [isWallDrawingActive, startWallDrawing]);

  /**
   * Met à jour le dessin en cours
   */
  const updateDrawing = useCallback((position: Vector2D) => {
    // Si un dessin de mur est en cours
    if (hasWallDrawingStarted) {
      // Obtenir le canvas de preview
      const previewCanvas = getPreviewCanvas();
      if (!previewCanvas) return false;
      
      const context = previewCanvas.getContext('2d');
      if (!context) return false;
      
      // Mettre à jour le dessin
      updateWallDrawing(context, position);
      
      return true;
    }
    
    return false;
  }, [hasWallDrawingStarted, getPreviewCanvas, updateWallDrawing]);

  /**
   * Termine le dessin en cours
   */
  const finishDrawing = useCallback((position: Vector2D) => {
    if (hasWallDrawingStarted) {
      finishWallDrawing(position);
      
      // Nettoyer le canvas de preview
      if (previewCanvasRef.current) {
        const context = previewCanvasRef.current.getContext('2d');
        if (context) {
          context.clearRect(0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);
        }
      }
      
      return true;
    }
    return false;
  }, [hasWallDrawingStarted, finishWallDrawing]);

  /**
   * Annule le dessin en cours
   */
  const cancelDrawing = useCallback(() => {
    if (hasWallDrawingStarted) {
      cancelWallDrawing();
      
      // Nettoyer le canvas de preview
      if (previewCanvasRef.current) {
        const context = previewCanvasRef.current.getContext('2d');
        if (context) {
          context.clearRect(0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);
        }
      }
      
      return true;
    }
    return false;
  }, [hasWallDrawingStarted, cancelWallDrawing]);

  /**
   * Vérifie si un mode de dessin est actif
   */
  const isDrawingActive = useCallback(() => {
    return drawingMode !== 'none';
  }, [drawingMode]);

  return {
    startDrawing,
    updateDrawing,
    finishDrawing,
    cancelDrawing,
    isDrawingActive
  };
}