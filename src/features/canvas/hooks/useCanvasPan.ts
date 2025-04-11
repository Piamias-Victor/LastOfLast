import { useCallback, useState, useRef } from 'react';
import { Vector2D } from '@/types/geometry';
import { useEditorStore } from '@/store';

interface UseCanvasPanResult {
  isPanning: boolean;
  startPan: (startPosition: Vector2D) => void;
  updatePan: (currentPosition: Vector2D) => void;
  endPan: () => void;
  handlePanKeyboard: (direction: 'up' | 'down' | 'left' | 'right', shiftKey: boolean) => void;
}

/**
 * Hook pour gérer le déplacement du canvas (panning)
 */
export function useCanvasPan(): UseCanvasPanResult {
  const { viewportOffset, setViewportOffset } = useEditorStore();
  const [isPanning, setIsPanning] = useState(false);
  
  // Utiliser useRef pour stocker les positions pour éviter des problèmes de closures
  const panStartRef = useRef<Vector2D | null>(null);
  const initialOffsetRef = useRef<Vector2D | null>(null);

  /**
   * Commence l'opération de pan
   */
  const startPan = useCallback((startPosition: Vector2D) => {
    setIsPanning(true);
    panStartRef.current = startPosition;
    initialOffsetRef.current = { ...viewportOffset };
  }, [viewportOffset]);

  /**
   * Met à jour la position du canvas pendant le pan
   */
  const updatePan = useCallback((currentPosition: Vector2D) => {
    if (!isPanning || !panStartRef.current || !initialOffsetRef.current) return;

    // Calculer le déplacement relatif depuis le début du pan
    const deltaX = currentPosition.x - panStartRef.current.x;
    const deltaY = currentPosition.y - panStartRef.current.y;
    
    // Mettre à jour l'offset du viewport
    setViewportOffset({
      x: initialOffsetRef.current.x + deltaX,
      y: initialOffsetRef.current.y + deltaY
    });
  }, [isPanning, setViewportOffset]);

  /**
   * Termine l'opération de pan
   */
  const endPan = useCallback(() => {
    setIsPanning(false);
    panStartRef.current = null;
    initialOffsetRef.current = null;
  }, []);

  /**
   * Gère le déplacement du canvas avec les touches du clavier
   */
  const handlePanKeyboard = useCallback((direction: 'up' | 'down' | 'left' | 'right', shiftKey: boolean) => {
    // Définir le pas de déplacement (plus rapide avec Shift)
    const step = shiftKey ? 50 : 20;
    
    // Appliquer le déplacement selon la direction
    switch (direction) {
      case 'up':
        setViewportOffset({
          ...viewportOffset,
          y: viewportOffset.y + step
        });
        break;
      case 'down':
        setViewportOffset({
          ...viewportOffset,
          y: viewportOffset.y - step
        });
        break;
      case 'left':
        setViewportOffset({
          ...viewportOffset,
          x: viewportOffset.x + step
        });
        break;
      case 'right':
        setViewportOffset({
          ...viewportOffset,
          x: viewportOffset.x - step
        });
        break;
    }
  }, [viewportOffset, setViewportOffset]);

  return { isPanning, startPan, updatePan, endPan, handlePanKeyboard };
}