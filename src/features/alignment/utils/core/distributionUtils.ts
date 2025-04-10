import { AnyPlanElement } from '@/types/elements';
import { AlignmentResult } from '../../types';

/**
 * Fonction utilitaire pour trier les éléments par position horizontale
 */
function sortElementsByX(elements: AnyPlanElement[]): AnyPlanElement[] {
  return [...elements].sort((a, b) => a.bounds.x - b.bounds.x);
}

/**
 * Fonction utilitaire pour trier les éléments par position verticale
 */
function sortElementsByY(elements: AnyPlanElement[]): AnyPlanElement[] {
  return [...elements].sort((a, b) => a.bounds.y - b.bounds.y);
}

/**
 * Distribue des éléments horizontalement de manière égale
 * 
 * @param elements Éléments à distribuer
 * @returns Résultats de la distribution avec les anciennes et nouvelles positions
 */
export function distributeHorizontally(elements: AnyPlanElement[]): AlignmentResult[] {
  if (elements.length <= 2) return [];
  
  // Trier les éléments par position X
  const sortedElements = sortElementsByX(elements);
  
  // Premier et dernier élément définissent les limites de la distribution
  const firstElement = sortedElements[0];
  const lastElement = sortedElements[sortedElements.length - 1];
  
  // Calculer l'espace total et l'espace entre les éléments
  const totalWidth = (lastElement.bounds.x + lastElement.bounds.width) - firstElement.bounds.x;
  const totalElementWidth = sortedElements.reduce((sum, el) => sum + el.bounds.width, 0);
  const spacing = (totalWidth - totalElementWidth) / (sortedElements.length - 1);
  
  // Créer les résultats de distribution
  const results: AlignmentResult[] = [];
  let currentX = firstElement.bounds.x + firstElement.bounds.width + spacing;
  
  // Distribuer les éléments (excepté le premier et le dernier)
  for (let i = 1; i < sortedElements.length - 1; i++) {
    const element = sortedElements[i];
    const oldPosition = { x: element.bounds.x, y: element.bounds.y };
    
    results.push({
      elementId: element.id,
      oldPosition,
      newPosition: { x: currentX, y: oldPosition.y }
    });
    
    currentX += element.bounds.width + spacing;
  }
  
  return results;
}

/**
 * Distribue des éléments verticalement de manière égale
 * 
 * @param elements Éléments à distribuer
 * @returns Résultats de la distribution avec les anciennes et nouvelles positions
 */
export function distributeVertically(elements: AnyPlanElement[]): AlignmentResult[] {
  if (elements.length <= 2) return [];
  
  // Trier les éléments par position Y
  const sortedElements = sortElementsByY(elements);
  
  // Premier et dernier élément définissent les limites de la distribution
  const firstElement = sortedElements[0];
  const lastElement = sortedElements[sortedElements.length - 1];
  
  // Calculer l'espace total et l'espace entre les éléments
  const totalHeight = (lastElement.bounds.y + lastElement.bounds.height) - firstElement.bounds.y;
  const totalElementHeight = sortedElements.reduce((sum, el) => sum + el.bounds.height, 0);
  const spacing = (totalHeight - totalElementHeight) / (sortedElements.length - 1);
  
  // Créer les résultats de distribution
  const results: AlignmentResult[] = [];
  let currentY = firstElement.bounds.y + firstElement.bounds.height + spacing;
  
  // Distribuer les éléments (excepté le premier et le dernier)
  for (let i = 1; i < sortedElements.length - 1; i++) {
    const element = sortedElements[i];
    const oldPosition = { x: element.bounds.x, y: element.bounds.y };
    
    results.push({
      elementId: element.id,
      oldPosition,
      newPosition: { x: oldPosition.x, y: currentY }
    });
    
    currentY += element.bounds.height + spacing;
  }
  
  return results;
}