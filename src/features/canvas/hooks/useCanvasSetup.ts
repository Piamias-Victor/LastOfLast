'use client';

import { useEffect } from 'react';
import { useEditorStore } from '@/states/editorStore';
import { ElementType, RectangleElement } from '@/types/elements';

/**
 * Hook pour initialiser le canvas avec un élément rectangle par défaut
 */
export function useCanvasSetup(): void {
  const { elements, addElement } = useEditorStore();
  
  // Ajouter un rectangle statique au chargement initial
  useEffect(() => {
    if (elements.length === 0) {
      // Ajouter un rectangle au centre du canvas
      const centerX = 600 - 100; // Moitié de la largeur - moitié de la largeur du rectangle
      const centerY = 450 - 60;  // Moitié de la hauteur - moitié de la hauteur du rectangle
      
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
}