'use client';

import { useEffect, useRef } from 'react';
import { useEditorStore } from '@/store';

/**
 * Hook pour gérer les raccourcis clavier de l'éditeur
 */
export function useEditorKeyboardShortcuts(onDeselectAll: () => void): void {
  const { 
    selectedElementIds, 
    elements, 
    updateElement 
  } = useEditorStore();
  
  // Utiliser une référence pour suivre si la touche R est enfoncée
  const isRKeyPressed = useRef<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Échap pour désélectionner tout
      if (e.key === 'Escape') {
        onDeselectAll();
        return;
      }
      
      // Sur macOS, certaines combinaisons de touches peuvent être différentes
      // Marquer la touche R comme enfoncée
      if (e.key === 'r' || e.key === 'R') {
        isRKeyPressed.current = true;
      }
      
      // Vérifier si un élément est sélectionné
      if (selectedElementIds.length !== 1) return;
      
      const elementId = selectedElementIds[0];
      const element = elements.find(el => el.id === elementId);
      if (!element) return;
      
      // Rotation avec les flèches quand R est enfoncé ou avec Ctrl/Cmd+flèches
      if (isRKeyPressed.current || e.ctrlKey || e.metaKey) {
        const currentRotation = element.transform.rotation;
        
        if (e.key === 'ArrowLeft') {
          // Rotation de 1° ou 15° si Shift est enfoncé
          const rotationStep = e.shiftKey ? 15 : 1;
          updateElement(elementId, {
            transform: {
              ...element.transform,
              rotation: (currentRotation - rotationStep + 360) % 360
            }
          });
          e.preventDefault();
        } else if (e.key === 'ArrowRight') {
          // Rotation de 1° ou 15° si Shift est enfoncé
          const rotationStep = e.shiftKey ? 15 : 1;
          updateElement(elementId, {
            transform: {
              ...element.transform,
              rotation: (currentRotation + rotationStep) % 360
            }
          });
          e.preventDefault();
        }
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      // Réinitialiser l'état de la touche R
      if (e.key === 'r' || e.key === 'R') {
        isRKeyPressed.current = false;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onDeselectAll, selectedElementIds, elements, updateElement]);
}