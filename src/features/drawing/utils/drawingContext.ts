'use client';

import { AnyPlanElement } from '@/types/elements';
import { DrawingContextState } from '../types';

/**
 * Crée un contexte de dessin avec des méthodes utilitaires pour gérer les transformations
 */
export function createDrawingContext(
  context: CanvasRenderingContext2D
): DrawingContextState {
  return {
    /**
     * Sauvegarde l'état actuel du contexte
     */
    save: () => {
      context.save();
    },
    
    /**
     * Restaure l'état précédemment sauvegardé du contexte
     */
    restore: () => {
      context.restore();
    },
    
    /**
     * Applique les transformations de l'élément au contexte
     */
    transform: (element: AnyPlanElement) => {
      const { transform, bounds } = element;
      
      if (transform.rotation !== 0) {
        // Calculer le centre de l'élément
        const centerX = bounds.x + bounds.width / 2;
        const centerY = bounds.y + bounds.height / 2;
        
        // Appliquer la rotation autour du centre
        context.translate(centerX, centerY);
        context.rotate((transform.rotation * Math.PI) / 180);
        context.translate(-centerX, -centerY);
      }
      
      // Appliquer l'échelle si différente de 1
      if (transform.scale.x !== 1 || transform.scale.y !== 1) {
        const centerX = bounds.x + bounds.width / 2;
        const centerY = bounds.y + bounds.height / 2;
        
        context.translate(centerX, centerY);
        context.scale(transform.scale.x, transform.scale.y);
        context.translate(-centerX, -centerY);
      }
    }
  };
}