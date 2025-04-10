import { AnyPlanElement } from '@/types/elements';
import { VerticalAlignment, AlignmentResult } from '../../types';
import { getElementAlignmentPoints } from './alignmentConstants';

/**
 * Aligne verticalement un ensemble d'éléments selon un alignement spécifié
 * 
 * @param elements Éléments à aligner
 * @param alignment Type d'alignement vertical (haut, milieu, bas)
 * @returns Résultats de l'alignement avec les anciennes et nouvelles positions
 */
export function alignElementsVertically(
  elements: AnyPlanElement[],
  alignment: VerticalAlignment
): AlignmentResult[] {
  if (elements.length <= 1) return [];
  
  // Obtenir les points d'alignement du premier élément comme référence
  const referencePoints = getElementAlignmentPoints(elements[0]);
  
  // Déterminer la valeur de référence selon le type d'alignement
  let referenceValue: number;
  switch (alignment) {
    case VerticalAlignment.TOP:
      referenceValue = referencePoints.top;
      break;
    case VerticalAlignment.MIDDLE:
      referenceValue = referencePoints.middle;
      break;
    case VerticalAlignment.BOTTOM:
      referenceValue = referencePoints.bottom;
      break;
  }
  
  // Créer les résultats d'alignement pour chaque élément (sauf le premier)
  return elements.slice(1).map(element => {
    const points = getElementAlignmentPoints(element);
    const oldPosition = { x: element.bounds.x, y: element.bounds.y };
    let newY: number;
    
    // Calculer la nouvelle position y selon le type d'alignement
    switch (alignment) {
      case VerticalAlignment.TOP:
        newY = referenceValue;
        break;
      case VerticalAlignment.MIDDLE:
        newY = referenceValue - element.bounds.height / 2;
        break;
      case VerticalAlignment.BOTTOM:
        newY = referenceValue - element.bounds.height;
        break;
    }
    
    return {
      elementId: element.id,
      oldPosition,
      newPosition: { x: oldPosition.x, y: newY }
    };
  });
}