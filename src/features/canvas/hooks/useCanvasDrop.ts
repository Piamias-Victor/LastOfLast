'use client';

import { useCallback } from 'react';
import { useEditorStore } from '@/store';
import { ElementType, CounterElement, GondolaElement, EndCapElement, BargainBinElement } from '@/types/elements';
import { DragData } from '@/features/library/types';
import { useCoordinateConversion } from './useCoordinateConversion';
import { snapPointToGrid } from '@/lib/utils';

/**
 * Hook pour gérer le drop d'éléments sur le canvas
 */
export function useCanvasDrop(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const { addElement, snapToGrid, gridSize } = useEditorStore();
  const { screenToCanvas } = useCoordinateConversion(canvasRef);
  
  // Gestionnaire pour le draggover (nécessaire pour permettre le drop)
  const handleDragOver = useCallback((e: React.DragEvent<HTMLCanvasElement>) => {
    // Empêcher le comportement par défaut pour autoriser le drop
    e.preventDefault();
    
    // Définir l'effet de copie
    e.dataTransfer.dropEffect = 'copy';
  }, []);
  
  // Gestionnaire pour le drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    try {
      // Récupérer les données transférées
      const data = e.dataTransfer.getData('application/json');
      if (!data) return;
      
      const dragData: DragData = JSON.parse(data);
      
      // Convertir les coordonnées de l'écran en coordonnées du canvas
      const position = screenToCanvas(e.clientX, e.clientY);
      
      // Appliquer la grille si nécessaire
      let x = position.x - dragData.width / 2;
      let y = position.y - dragData.height / 2;
      
      if (snapToGrid) {
        x = snapPointToGrid({ x, y: 0 }, gridSize).x;
        y = snapPointToGrid({ x: 0, y }, gridSize).y;
      }
      
      // Créer un nouvel élément selon le type
      switch (dragData.type) {
        case ElementType.COUNTER:
          addElement({
            type: ElementType.COUNTER,
            bounds: {
              x,
              y,
              width: dragData.width,
              height: dragData.height,
            },
            transform: {
              position: { x, y },
              rotation: 0,
              scale: { x: 1, y: 1 },
            },
            zIndex: 10,
            isLocked: false,
            isVisible: true,
            isSelected: true,
            metadata: {
              name: 'Nouveau comptoir',
              customProperties: {},
            },
            stations: 2,
            hasStorage: true,
            counterHeight: 90,
            isAccessible: false,
            backgroundColor: '#0a5b91',
            borderColor: '#003e6b',
            borderWidth: 2,
          } as Omit<CounterElement, 'id'>);
          break;
        case ElementType.GONDOLA:
          addElement({
            type: ElementType.GONDOLA,
            bounds: {
              x,
              y,
              width: dragData.width,
              height: dragData.height,
            },
            transform: {
              position: { x, y },
              rotation: 0,
              scale: { x: 1, y: 1 },
            },
            zIndex: 10,
            isLocked: false,
            isVisible: true,
            isSelected: true,
            metadata: {
              name: 'Nouveau rayon',
              customProperties: {},
            },
            shelfCount: 4,
            shelfHeight: 30,
            shelfDepth: 40,
            doubleSided: false,
            backgroundColor: '#66a5ad',
            borderColor: '#0a5b91',
            borderWidth: 2,
            rackColor: '#e0e0e0',
          } as Omit<GondolaElement, 'id'>);
          break;
        case ElementType.END_CAP:
          addElement({
            type: ElementType.END_CAP,
            bounds: {
              x,
              y,
              width: dragData.width,
              height: dragData.height,
            },
            transform: {
              position: { x, y },
              rotation: 0,
              scale: { x: 1, y: 1 },
            },
            zIndex: 10,
            isLocked: false,
            isVisible: true,
            isSelected: true,
            metadata: {
              name: 'Nouvelle tête de gondole',
              customProperties: {},
            },
            shelfCount: 3,
            shelfHeight: 35,
            shelfDepth: 45,
            isPremium: true,
            backgroundColor: '#f59e0b',
            borderColor: '#d97706',
            borderWidth: 2,
            highlightColor: '#fbbf24',
          } as Omit<EndCapElement, 'id'>);
          break;
        case ElementType.BARGAIN_BIN:
          addElement({
            type: ElementType.BARGAIN_BIN,
            bounds: {
              x,
              y,
              width: dragData.width,
              height: dragData.height,
            },
            transform: {
              position: { x, y },
              rotation: 0,
              scale: { x: 1, y: 1 },
            },
            zIndex: 10,
            isLocked: false,
            isVisible: true,
            isSelected: true,
            metadata: {
              name: 'Nouveau bac soldeur',
              customProperties: {},
            },
            depth: 50,
            isRound: dragData.width === dragData.height, // Rond si carré, rectangulaire sinon
            hasSignage: true,
            discountLabel: '-50%',
            backgroundColor: '#ef4444', // Rouge
            borderColor: '#b91c1c',
            borderWidth: 2,
          } as Omit<BargainBinElement, 'id'>);
          break;
        default:
          console.warn(`Type d'élément non géré pour le drop: ${dragData.type}`);
      }
    } catch (error) {
      console.error('Erreur lors du drop:', error);
    }
  }, [addElement, screenToCanvas, snapToGrid, gridSize]);
  
  return {
    handleDragOver,
    handleDrop
  };
}