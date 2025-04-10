// src/features/canvas/hooks/useWallDrawing.ts
'use client';

import { useCallback } from 'react';
import { Vector2D } from '@/types/geometry';
import { useEditorStore } from '@/store';
import { ElementType, WallElement } from '@/types/elements';
import { calculateWallBounds } from '@/features/drawing/utils/wallDrawing';
import { useSnappingUtils } from './operations/useSnappingUtils';

/**
 * Hook pour gérer le dessin et la création de murs
 */
export function useWallDrawing() {
  const { 
    drawingMode, 
    drawingStartPoint, 
    setDrawingStartPoint, 
    addElement,
    zoom,
    viewportOffset
  } = useEditorStore();
  
  const { applyGridSnapping } = useSnappingUtils();

  /**
   * Commence le dessin d'un nouveau mur
   */
  const startWallDrawing = useCallback((position: Vector2D) => {
    if (drawingMode !== 'wall') return;
    
    // Appliquer le snapping à la grille
    const snappedPosition = applyGridSnapping(position);
    
    // Enregistrer le point de départ
    setDrawingStartPoint(snappedPosition);
  }, [drawingMode, setDrawingStartPoint, applyGridSnapping]);

  /**
   * Met à jour le preview du mur pendant le dessin
   */
  const updateWallDrawing = useCallback((context: CanvasRenderingContext2D, endPosition: Vector2D) => {
    if (drawingMode !== 'wall' || !drawingStartPoint) return;

    // Effacer le canvas complet
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    
    // Appliquer le snapping à la grille
    const snappedEndPosition = applyGridSnapping(endPosition);
    
    // Dessiner le preview du mur
    context.save();
    
    // Appliquer le zoom et l'offset
    context.translate(viewportOffset.x, viewportOffset.y);
    context.scale(zoom, zoom);
    
    // Dessiner une ligne pointillée pour le preview
    context.beginPath();
    context.strokeStyle = 'rgba(10, 91, 145, 0.8)';
    context.lineWidth = 10; 
    context.lineCap = 'round';
    context.setLineDash([5, 3]);
    context.moveTo(drawingStartPoint.x, drawingStartPoint.y);
    context.lineTo(snappedEndPosition.x, snappedEndPosition.y);
    context.stroke();
    context.setLineDash([]);
    
    context.restore();
    
    // Forcer un rafraîchissement du canvas principal
    window.dispatchEvent(new Event('refreshCanvas'));
  }, [drawingMode, drawingStartPoint, applyGridSnapping, zoom, viewportOffset]);

  /**
   * Termine le dessin d'un mur et l'ajoute au plan
   */
  const finishWallDrawing = useCallback((endPosition: Vector2D) => {
    if (drawingMode !== 'wall' || !drawingStartPoint) return;
    
    // Appliquer le snapping à la grille
    const snappedEndPosition = applyGridSnapping(endPosition);
    
    // Calcul de la distance entre les points pour éviter de créer des murs trop courts
    const dx = snappedEndPosition.x - drawingStartPoint.x;
    const dy = snappedEndPosition.y - drawingStartPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 20) {
      // Le mur est trop court, annuler la création
      setDrawingStartPoint(null);
      return;
    }
    
    // Épaisseur de mur par défaut
    const wallThickness = 10;
    
    // Calculer les bounds du mur
    const bounds = calculateWallBounds(drawingStartPoint, snappedEndPosition, wallThickness);
    
    // Créer le nouvel élément mur
    addElement({
      type: ElementType.WALL,
      bounds,
      transform: {
        position: { x: bounds.x, y: bounds.y },
        rotation: 0,
        scale: { x: 1, y: 1 }
      },
      zIndex: 1,
      isLocked: false,
      isVisible: true,
      isSelected: true,
      metadata: {
        name: 'Nouveau mur',
        customProperties: {}
      },
      startPoint: { ...drawingStartPoint },
      endPoint: { ...snappedEndPosition },
      thickness: wallThickness,
      color: '#0a5b91',
      isStructural: true
    } as Omit<WallElement, 'id'>);
    
    // Réinitialiser l'état de dessin (mais garder le mode actif pour dessiner plusieurs murs)
    setDrawingStartPoint(null);
  }, [drawingMode, drawingStartPoint, applyGridSnapping, addElement, setDrawingStartPoint]);

  /**
   * Annule le dessin d'un mur en cours
   */
  const cancelWallDrawing = useCallback(() => {
    setDrawingStartPoint(null);
  }, [setDrawingStartPoint]);

  return {
    startWallDrawing,
    updateWallDrawing,
    finishWallDrawing,
    cancelWallDrawing,
    isWallDrawingActive: drawingMode === 'wall',
    hasWallDrawingStarted: !!drawingStartPoint
  };
}