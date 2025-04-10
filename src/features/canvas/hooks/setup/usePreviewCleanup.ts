// src/features/canvas/hooks/setup/usePreviewCleanup.ts (nouveau fichier)
'use client';

import { useEffect, useRef } from 'react';
import { useEditorStore } from '@/store';

/**
 * Hook pour gérer le nettoyage des previews de dessin
 */
export function usePreviewCleanup(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const { drawingMode, drawingStartPoint } = useEditorStore();
  const animationFrameRef = useRef<number | null>(null);

  // Mettre en place un nettoyage pour les animations
  useEffect(() => {
    // Fonction de nettoyage qui sera appelée avant chaque rendu
    const cleanupPreview = () => {
      if (!canvasRef.current) return;
      
      const context = canvasRef.current.getContext('2d');
      if (!context) return;
      
      // Forcer un rendu complet du canvas
      const renderEvent = new CustomEvent('forcerender');
      window.dispatchEvent(renderEvent);
      
      // Continuer la boucle d'animation si le mode dessin est actif
      if (drawingMode !== 'none') {
        animationFrameRef.current = requestAnimationFrame(cleanupPreview);
      }
    };
    
    // Démarrer la boucle uniquement si on est en mode dessin
    if (drawingMode !== 'none' && drawingStartPoint) {
      animationFrameRef.current = requestAnimationFrame(cleanupPreview);
    }
    
    // Nettoyer la boucle d'animation lors du démontage
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawingMode, drawingStartPoint, canvasRef]);
}