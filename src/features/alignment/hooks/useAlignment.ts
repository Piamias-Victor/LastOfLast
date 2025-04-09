'use client';

import { useState, useCallback } from 'react';
import { Vector2D } from '@/types/geometry';
import { useEditorStore } from '@/store';
import { HorizontalAlignment, VerticalAlignment, AlignmentGuide } from '../types';
import {
  alignElementsHorizontally,
  alignElementsVertically,
  distributeHorizontally,
  distributeVertically,
  detectAlignmentGuides,
  snapToGuides,
  ALIGNMENT_THRESHOLD
} from '../utils/alignmentUtils';

/**
 * Hook pour gérer l'alignement des éléments
 */
export function useAlignment() {
  const { elements, selectedElementIds, updateElement } = useEditorStore();
  const [activeGuides, setActiveGuides] = useState<AlignmentGuide[]>([]);
  
  /**
   * Aligne les éléments sélectionnés horizontalement
   */
  const alignHorizontally = useCallback((alignment: HorizontalAlignment) => {
    if (selectedElementIds.length <= 1) return;
    
    // Récupérer les éléments sélectionnés
    const selectedElements = elements.filter(element => 
      selectedElementIds.includes(element.id)
    );
    
    // Calculer les nouvelles positions
    const alignmentResults = alignElementsHorizontally(selectedElements, alignment);
    
    // Mettre à jour les éléments
    alignmentResults.forEach(result => {
      updateElement(result.elementId, {
        bounds: {
          ...elements.find(el => el.id === result.elementId)!.bounds,
          x: result.newPosition.x
        },
        transform: {
          ...elements.find(el => el.id === result.elementId)!.transform,
          position: {
            ...elements.find(el => el.id === result.elementId)!.transform.position,
            x: result.newPosition.x
          }
        }
      });
    });
  }, [elements, selectedElementIds, updateElement]);
  
  /**
   * Aligne les éléments sélectionnés verticalement
   */
  const alignVertically = useCallback((alignment: VerticalAlignment) => {
    if (selectedElementIds.length <= 1) return;
    
    // Récupérer les éléments sélectionnés
    const selectedElements = elements.filter(element => 
      selectedElementIds.includes(element.id)
    );
    
    // Calculer les nouvelles positions
    const alignmentResults = alignElementsVertically(selectedElements, alignment);
    
    // Mettre à jour les éléments
    alignmentResults.forEach(result => {
      updateElement(result.elementId, {
        bounds: {
          ...elements.find(el => el.id === result.elementId)!.bounds,
          y: result.newPosition.y
        },
        transform: {
          ...elements.find(el => el.id === result.elementId)!.transform,
          position: {
            ...elements.find(el => el.id === result.elementId)!.transform.position,
            y: result.newPosition.y
          }
        }
      });
    });
  }, [elements, selectedElementIds, updateElement]);
  
  /**
   * Distribue les éléments sélectionnés horizontalement
   */
  const distributeElementsHorizontally = useCallback(() => {
    if (selectedElementIds.length <= 2) return;
    
    // Récupérer les éléments sélectionnés
    const selectedElements = elements.filter(element => 
      selectedElementIds.includes(element.id)
    );
    
    // Calculer les nouvelles positions
    const distributionResults = distributeHorizontally(selectedElements);
    
    // Mettre à jour les éléments
    distributionResults.forEach(result => {
      updateElement(result.elementId, {
        bounds: {
          ...elements.find(el => el.id === result.elementId)!.bounds,
          x: result.newPosition.x
        },
        transform: {
          ...elements.find(el => el.id === result.elementId)!.transform,
          position: {
            ...elements.find(el => el.id === result.elementId)!.transform.position,
            x: result.newPosition.x
          }
        }
      });
    });
  }, [elements, selectedElementIds, updateElement]);
  
  /**
   * Distribue les éléments sélectionnés verticalement
   */
  const distributeElementsVertically = useCallback(() => {
    if (selectedElementIds.length <= 2) return;
    
    // Récupérer les éléments sélectionnés
    const selectedElements = elements.filter(element => 
      selectedElementIds.includes(element.id)
    );
    
    // Calculer les nouvelles positions
    const distributionResults = distributeVertically(selectedElements);
    
    // Mettre à jour les éléments
    distributionResults.forEach(result => {
      updateElement(result.elementId, {
        bounds: {
          ...elements.find(el => el.id === result.elementId)!.bounds,
          y: result.newPosition.y
        },
        transform: {
          ...elements.find(el => el.id === result.elementId)!.transform,
          position: {
            ...elements.find(el => el.id === result.elementId)!.transform.position,
            y: result.newPosition.y
          }
        }
      });
    });
  }, [elements, selectedElementIds, updateElement]);
  
  /**
   * Détecte et applique les guides d'alignement pour un élément en mouvement
   */
  const checkAlignment = useCallback((
    elementId: string,
    proposedPosition: Vector2D
  ): Vector2D => {
    const movingElement = elements.find(el => el.id === elementId);
    if (!movingElement) return proposedPosition;
    
    // Récupérer les autres éléments
    const otherElements = elements.filter(el => el.id !== elementId);
    if (otherElements.length === 0) return proposedPosition;
    
    // Créer un élément temporaire avec la position proposée
    const tempElement = {
      ...movingElement,
      bounds: {
        ...movingElement.bounds,
        x: proposedPosition.x,
        y: proposedPosition.y
      }
    };
    
    // Détecter les guides d'alignement
    const guides = detectAlignmentGuides(tempElement, otherElements, ALIGNMENT_THRESHOLD);
    
    // Mettre à jour les guides actifs
    setActiveGuides(guides);
    
    // Ajuster la position selon les guides
    if (guides.length > 0) {
      return snapToGuides(proposedPosition, movingElement, guides);
    }
    
    return proposedPosition;
  }, [elements]);
  
  /**
   * Efface les guides d'alignement
   */
  const clearGuides = useCallback(() => {
    setActiveGuides([]);
  }, []);
  
  return {
    activeGuides,
    alignHorizontally,
    alignVertically,
    distributeElementsHorizontally,
    distributeElementsVertically,
    checkAlignment,
    clearGuides
  };
}