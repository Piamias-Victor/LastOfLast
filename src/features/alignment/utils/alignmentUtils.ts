import { Vector2D } from '@/types/geometry';
import { AnyPlanElement } from '@/types/elements';
import { HorizontalAlignment, VerticalAlignment, AlignmentResult, AlignmentGuide } from '../types';

/**
 * Seuil de proximité pour l'alignement automatique (en pixels)
 */
export const ALIGNMENT_THRESHOLD = 5;

/**
 * Aligne horizontalement un ensemble d'éléments
 */
export function alignElementsHorizontally(
  elements: AnyPlanElement[],
  alignment: HorizontalAlignment
): AlignmentResult[] {
  if (elements.length <= 1) return [];
  
  // Trouver la valeur de référence pour l'alignement
  let referenceValue: number;
  
  switch (alignment) {
    case HorizontalAlignment.LEFT:
      // Aligner sur le bord gauche du premier élément
      referenceValue = elements[0].bounds.x;
      break;
    case HorizontalAlignment.CENTER:
      // Aligner sur le centre du premier élément
      referenceValue = elements[0].bounds.x + elements[0].bounds.width / 2;
      break;
    case HorizontalAlignment.RIGHT:
      // Aligner sur le bord droit du premier élément
      referenceValue = elements[0].bounds.x + elements[0].bounds.width;
      break;
  }
  
  // Calculer les nouvelles positions
  const results: AlignmentResult[] = [];
  
  for (let i = 1; i < elements.length; i++) {
    const element = elements[i];
    const oldPosition = { x: element.bounds.x, y: element.bounds.y };
    let newX: number;
    
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
    
    results.push({
      elementId: element.id,
      oldPosition,
      newPosition: { x: newX, y: oldPosition.y }
    });
  }
  
  return results;
}

/**
 * Aligne verticalement un ensemble d'éléments
 */
export function alignElementsVertically(
  elements: AnyPlanElement[],
  alignment: VerticalAlignment
): AlignmentResult[] {
  if (elements.length <= 1) return [];
  
  // Trouver la valeur de référence pour l'alignement
  let referenceValue: number;
  
  switch (alignment) {
    case VerticalAlignment.TOP:
      // Aligner sur le bord supérieur du premier élément
      referenceValue = elements[0].bounds.y;
      break;
    case VerticalAlignment.MIDDLE:
      // Aligner sur le centre du premier élément
      referenceValue = elements[0].bounds.y + elements[0].bounds.height / 2;
      break;
    case VerticalAlignment.BOTTOM:
      // Aligner sur le bord inférieur du premier élément
      referenceValue = elements[0].bounds.y + elements[0].bounds.height;
      break;
  }
  
  // Calculer les nouvelles positions
  const results: AlignmentResult[] = [];
  
  for (let i = 1; i < elements.length; i++) {
    const element = elements[i];
    const oldPosition = { x: element.bounds.x, y: element.bounds.y };
    let newY: number;
    
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
    
    results.push({
      elementId: element.id,
      oldPosition,
      newPosition: { x: oldPosition.x, y: newY }
    });
  }
  
  return results;
}

/**
 * Distribue des éléments horizontalement de manière égale
 */
export function distributeHorizontally(elements: AnyPlanElement[]): AlignmentResult[] {
  if (elements.length <= 2) return [];
  
  // Trier les éléments par position X
  const sortedElements = [...elements].sort((a, b) => a.bounds.x - b.bounds.x);
  
  // Calculer l'espace total et l'espace entre les éléments
  const firstElement = sortedElements[0];
  const lastElement = sortedElements[sortedElements.length - 1];
  
  const totalWidth = (lastElement.bounds.x + lastElement.bounds.width) - firstElement.bounds.x;
  const totalElementWidth = sortedElements.reduce((sum, el) => sum + el.bounds.width, 0);
  const spacing = (totalWidth - totalElementWidth) / (sortedElements.length - 1);
  
  // Calculer les nouvelles positions
  const results: AlignmentResult[] = [];
  let currentX = firstElement.bounds.x + firstElement.bounds.width + spacing;
  
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
 */
export function distributeVertically(elements: AnyPlanElement[]): AlignmentResult[] {
  if (elements.length <= 2) return [];
  
  // Trier les éléments par position Y
  const sortedElements = [...elements].sort((a, b) => a.bounds.y - b.bounds.y);
  
  // Calculer l'espace total et l'espace entre les éléments
  const firstElement = sortedElements[0];
  const lastElement = sortedElements[sortedElements.length - 1];
  
  const totalHeight = (lastElement.bounds.y + lastElement.bounds.height) - firstElement.bounds.y;
  const totalElementHeight = sortedElements.reduce((sum, el) => sum + el.bounds.height, 0);
  const spacing = (totalHeight - totalElementHeight) / (sortedElements.length - 1);
  
  // Calculer les nouvelles positions
  const results: AlignmentResult[] = [];
  let currentY = firstElement.bounds.y + firstElement.bounds.height + spacing;
  
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

/**
 * Détecte les guides d'alignement pour un élément en mouvement
 */
export function detectAlignmentGuides(
  movingElement: AnyPlanElement,
  otherElements: AnyPlanElement[],
  threshold: number = ALIGNMENT_THRESHOLD
): AlignmentGuide[] {
  const guides: AlignmentGuide[] = [];
  
  // Points importants de l'élément mobile
  const movingLeft = movingElement.bounds.x;
  const movingRight = movingElement.bounds.x + movingElement.bounds.width;
  const movingTop = movingElement.bounds.y;
  const movingBottom = movingElement.bounds.y + movingElement.bounds.height;
  const movingCenterX = movingElement.bounds.x + movingElement.bounds.width / 2;
  const movingCenterY = movingElement.bounds.y + movingElement.bounds.height / 2;
  
  // Vérifier l'alignement avec chaque élément statique
  for (const element of otherElements) {
    if (element.id === movingElement.id) continue;
    
    const staticLeft = element.bounds.x;
    const staticRight = element.bounds.x + element.bounds.width;
    const staticTop = element.bounds.y;
    const staticBottom = element.bounds.y + element.bounds.height;
    const staticCenterX = element.bounds.x + element.bounds.width / 2;
    const staticCenterY = element.bounds.y + element.bounds.height / 2;
    
    // Guides horizontaux (alignement vertical)
    
    // Bord supérieur avec bord supérieur
    if (Math.abs(movingTop - staticTop) < threshold) {
      guides.push({
        id: `h-top-${element.id}`,
        type: 'horizontal',
        position: staticTop,
        start: Math.min(movingLeft, staticLeft),
        end: Math.max(movingRight, staticRight)
      });
    }
    
    // Bord inférieur avec bord inférieur
    if (Math.abs(movingBottom - staticBottom) < threshold) {
      guides.push({
        id: `h-bottom-${element.id}`,
        type: 'horizontal',
        position: staticBottom,
        start: Math.min(movingLeft, staticLeft),
        end: Math.max(movingRight, staticRight)
      });
    }
    
    // Centre avec centre
    if (Math.abs(movingCenterY - staticCenterY) < threshold) {
      guides.push({
        id: `h-center-${element.id}`,
        type: 'horizontal',
        position: staticCenterY,
        start: Math.min(movingLeft, staticLeft),
        end: Math.max(movingRight, staticRight)
      });
    }
    
    // Bord supérieur avec bord inférieur
    if (Math.abs(movingTop - staticBottom) < threshold) {
      guides.push({
        id: `h-topbottom-${element.id}`,
        type: 'horizontal',
        position: staticBottom,
        start: Math.min(movingLeft, staticLeft),
        end: Math.max(movingRight, staticRight)
      });
    }
    
    // Bord inférieur avec bord supérieur
    if (Math.abs(movingBottom - staticTop) < threshold) {
      guides.push({
        id: `h-bottomtop-${element.id}`,
        type: 'horizontal',
        position: staticTop,
        start: Math.min(movingLeft, staticLeft),
        end: Math.max(movingRight, staticRight)
      });
    }
    
    // Guides verticaux (alignement horizontal)
    
    // Bord gauche avec bord gauche
    if (Math.abs(movingLeft - staticLeft) < threshold) {
      guides.push({
        id: `v-left-${element.id}`,
        type: 'vertical',
        position: staticLeft,
        start: Math.min(movingTop, staticTop),
        end: Math.max(movingBottom, staticBottom)
      });
    }
    
    // Bord droit avec bord droit
    if (Math.abs(movingRight - staticRight) < threshold) {
      guides.push({
        id: `v-right-${element.id}`,
        type: 'vertical',
        position: staticRight,
        start: Math.min(movingTop, staticTop),
        end: Math.max(movingBottom, staticBottom)
      });
    }
    
    // Centre avec centre
    if (Math.abs(movingCenterX - staticCenterX) < threshold) {
      guides.push({
        id: `v-center-${element.id}`,
        type: 'vertical',
        position: staticCenterX,
        start: Math.min(movingTop, staticTop),
        end: Math.max(movingBottom, staticBottom)
      });
    }
    
    // Bord gauche avec bord droit
    if (Math.abs(movingLeft - staticRight) < threshold) {
      guides.push({
        id: `v-leftright-${element.id}`,
        type: 'vertical',
        position: staticRight,
        start: Math.min(movingTop, staticTop),
        end: Math.max(movingBottom, staticBottom)
      });
    }
    
    // Bord droit avec bord gauche
    if (Math.abs(movingRight - staticLeft) < threshold) {
      guides.push({
        id: `v-rightleft-${element.id}`,
        type: 'vertical',
        position: staticLeft,
        start: Math.min(movingTop, staticTop),
        end: Math.max(movingBottom, staticBottom)
      });
    }
  }
  
  return guides;
}

/**
 * Ajuste la position d'un élément selon les guides d'alignement
 */
export function snapToGuides(
  position: Vector2D,
  element: AnyPlanElement,
  guides: AlignmentGuide[]
): Vector2D {
  let { x, y } = position;
  
  // Points importants de l'élément
  const width = element.bounds.width;
  const height = element.bounds.height;
  const right = x + width;
  const bottom = y + height;
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  
  // Pour chaque guide, vérifier s'il faut s'aligner
  for (const guide of guides) {
    if (guide.type === 'horizontal') {
      // Guides horizontaux (alignement vertical)
      if (Math.abs(y - guide.position) < ALIGNMENT_THRESHOLD) {
        // Bord supérieur
        y = guide.position;
      } else if (Math.abs(bottom - guide.position) < ALIGNMENT_THRESHOLD) {
        // Bord inférieur
        y = guide.position - height;
      } else if (Math.abs(centerY - guide.position) < ALIGNMENT_THRESHOLD) {
        // Centre
        y = guide.position - height / 2;
      }
    } else {
      // Guides verticaux (alignement horizontal)
      if (Math.abs(x - guide.position) < ALIGNMENT_THRESHOLD) {
        // Bord gauche
        x = guide.position;
      } else if (Math.abs(right - guide.position) < ALIGNMENT_THRESHOLD) {
        // Bord droit
        x = guide.position - width;
      } else if (Math.abs(centerX - guide.position) < ALIGNMENT_THRESHOLD) {
        // Centre
        x = guide.position - width / 2;
      }
    }
  }
  
  return { x, y };
}