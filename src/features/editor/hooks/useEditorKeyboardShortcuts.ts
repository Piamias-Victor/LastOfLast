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
    updateElement,
    removeSelectedElements,
    copySelectedElements,
    pasteElements,
    cutSelectedElements,
  } = useEditorStore();
  
  // Utiliser une référence pour suivre si la touche R est enfoncée
  const isRKeyPressed = useRef<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Éviter d'intercepter les raccourcis clavier quand un élément d'entrée est actif
      if (
        document.activeElement &&
        (document.activeElement.tagName === 'INPUT' ||
          document.activeElement.tagName === 'TEXTAREA')
      ) {
        return;
      }

      // Échap pour désélectionner tout
      if (e.key === 'Escape') {
        onDeselectAll();
        return;
      }
      
      // Delete ou Backspace pour supprimer les éléments sélectionnés
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Empêcher la navigation arrière du navigateur avec Backspace
        if (e.key === 'Backspace') {
          e.preventDefault();
        }
        
        // Si des éléments sont sélectionnés, les supprimer
        if (selectedElementIds.length > 0) {
          removeSelectedElements();
          return;
        }
      }
      
      // Copier avec Ctrl+C ou Cmd+C
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        copySelectedElements();
        e.preventDefault();
        return;
      }
      
      // Coller avec Ctrl+V ou Cmd+V
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        pasteElements();
        e.preventDefault();
        return;
      }
      
      // Couper avec Ctrl+X ou Cmd+X
      if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
        cutSelectedElements();
        e.preventDefault();
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
  }, [
    onDeselectAll, 
    selectedElementIds, 
    elements, 
    updateElement, 
    removeSelectedElements,
    copySelectedElements,
    pasteElements,
    cutSelectedElements
  ]);
}