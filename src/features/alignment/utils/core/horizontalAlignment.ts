import { AnyPlanElement } from '@/types/elements';
import { HorizontalAlignment, AlignmentResult } from '../../types';
import { getElementAlignmentPoints } from './alignmentConstants';

/**
 * Aligne horizontalement un ensemble d'éléments selon un alignement spécifié
 * 
 * @param elements Éléments à aligner
 * @param alignment Type d'alignement horizontal (gauche, centre, droite)
 * @returns Résultats de l'alignement avec les anciennes et nouvelles positions
 */
export function alignElementsHorizontally(
  elements: AnyPlanElement[],
  alignment: HorizontalAlignment
): AlignmentResult[] {
  if (elements.length <= 1) return [];
  
  // Obtenir les points d'alignement du premier élément comme référence
  const referencePoints = getElementAlignmentPoints(elements[0]);
  
  // Déterminer la valeur de référence selon le type d'alignement
  let referenceValue: number;
  switch (alignment) {
    case HorizontalAlignment.LEFT:
      referenceValue = referencePoints.left;
      break;
    case HorizontalAlignment.CENTER:
      referenceValue = referencePoints.center;
      break;
    case HorizontalAlignment.RIGHT:
      referenceValue = referencePoints.right;
      break;
  }
  
  // Créer les résultats d'alignement pour chaque élément (sauf le premier)
  return elements.slice(1).map(element => {
    const points = getElementAlignmentPoints(element);
    const oldPosition = { x: element.bounds.x, y: element.bounds.y };
    let newX: number;
    
    // Calculer la nouvelle position x selon le type d'alignement
    switch (alignment) {
      case HorizontalAlignment.LEFT:
        newX = referenceValue;
        break;
      case HorizontalAlignment.CENTER:
        newX = referenceValue - element.bounds.width / 2;
        break;
      case HorizontalAlignment.RIGHT:
        newX = referenceValue - element.bounds.width;
        break;
    }
    
    return {
      elementId: element.id,
      oldPosition,
      newPosition: { x: newX, y: oldPosition.y }
    };
  });
}