'use client';

import { useCallback } from 'react';
import { Vector2D } from '@/types/geometry';
import { DEFAULT_EDITOR_CONFIG } from '@/lib/constants/editor';

interface UseCanvasZoomProps {
  zoom: number;
  viewportOffset: Vector2D;
  setZoom: (zoom: number) => void;
  setViewportOffset: (offset: Vector2D) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

interface UseCanvasZoomResult {
  handleWheel: (e: React.WheelEvent<HTMLCanvasElement>) => void;
}

/**
 * Hook pour gérer le zoom du canvas
 */
export function useCanvasZoom({
  zoom,
  viewportOffset,
  setZoom,
  setViewportOffset,
  canvasRef
}: UseCanvasZoomProps): UseCanvasZoomResult {
  /**
   * Gestion du zoom avec la molette
   */
  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
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
  }, [zoom, viewportOffset, setZoom, setViewportOffset, canvasRef]);

  return { handleWheel };
}