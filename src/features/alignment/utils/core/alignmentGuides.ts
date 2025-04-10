import { Vector2D } from '@/types/geometry';
import { AnyPlanElement } from '@/types/elements';
import { AlignmentGuide } from '../../types';
import { ALIGNMENT_THRESHOLD, getElementAlignmentPoints, isClose } from './alignmentConstants';

/**
 * Génère un guide horizontal d'alignement
 */
function createHorizontalGuide(
  id: string,
  position: number,
  startX: number,
  endX: number
): AlignmentGuide {
  return {
    id: `h-${id}`,
    type: 'horizontal',
    position,
    start: startX,
    end: endX
  };
}

/**
 * Génère un guide vertical d'alignement
 */
function createVerticalGuide(
  id: string,
  position: number,
  startY: number,
  endY: number
): AlignmentGuide {
  return {
    id: `v-${id}`,
    type: 'vertical',
    position,
    start: startY,
    end: endY
  };
}

/**
 * Détecte les guides d'alignement horizontal entre deux éléments
 */
function detectHorizontalGuides(
  movingElement: AnyPlanElement,
  staticElement: AnyPlanElement,
  threshold: number
): AlignmentGuide[] {
  const guides: AlignmentGuide[] = [];
  
  // Points d'alignement des éléments
  const movingPoints = getElementAlignmentPoints(movingElement);
  const staticPoints = getElementAlignmentPoints(staticElement);
  
  // Limites horizontales pour déterminer la longueur des guides
  const startX = Math.min(movingPoints.left, staticPoints.left);
  const endX = Math.max(movingPoints.right, staticPoints.right);
  
  // Vérifier les alignements horizontaux (top, middle, bottom)
  
  // Bord supérieur avec bord supérieur
  if (isClose(movingPoints.top, staticPoints.top, threshold)) {
    guides.push(createHorizontalGuide(
      `top-${staticElement.id}`,
      staticPoints.top,
      startX,
      endX
    ));
  }
  
  // Centre avec centre
  if (isClose(movingPoints.middle, staticPoints.middle, threshold)) {
    guides.push(createHorizontalGuide(
      `middle-${staticElement.id}`,
      staticPoints.middle,
      startX,
      endX
    ));
  }
  
  // Bord inférieur avec bord inférieur
  if (isClose(movingPoints.bottom, staticPoints.bottom, threshold)) {
    guides.push(createHorizontalGuide(
      `bottom-${staticElement.id}`,
      staticPoints.bottom,
      startX,
      endX
    ));
  }
  
  // Bord supérieur avec bord inférieur
  if (isClose(movingPoints.top, staticPoints.bottom, threshold)) {
    guides.push(createHorizontalGuide(
      `topbottom-${staticElement.id}`,
      staticPoints.bottom,
      startX,
      endX
    ));
  }
  
  // Bord inférieur avec bord supérieur
  if (isClose(movingPoints.bottom, staticPoints.top, threshold)) {
    guides.push(createHorizontalGuide(
      `bottomtop-${staticElement.id}`,
      staticPoints.top,
      startX,
      endX
    ));
  }
  
  return guides;
}

/**
 * Détecte les guides d'alignement vertical entre deux éléments
 */
function detectVerticalGuides(
  movingElement: AnyPlanElement,
  staticElement: AnyPlanElement,
  threshold: number
): AlignmentGuide[] {
  const guides: AlignmentGuide[] = [];
  
  // Points d'alignement des éléments
  const movingPoints = getElementAlignmentPoints(movingElement);
  const staticPoints = getElementAlignmentPoints(staticElement);
  
  // Limites verticales pour déterminer la longueur des guides
  const startY = Math.min(movingPoints.top, staticPoints.top);
  const endY = Math.max(movingPoints.bottom, staticPoints.bottom);
  
  // Vérifier les alignements verticaux (left, center, right)
  
  // Bord gauche avec bord gauche
  if (isClose(movingPoints.left, staticPoints.left, threshold)) {
    guides.push(createVerticalGuide(
      `left-${staticElement.id}`,
      staticPoints.left,
      startY,
      endY
    ));
  }
  
  // Centre avec centre
  if (isClose(movingPoints.center, staticPoints.center, threshold)) {
    guides.push(createVerticalGuide(
      `center-${staticElement.id}`,
      staticPoints.center,
      startY,
      endY
    ));
  }
  
  // Bord droit avec bord droit
  if (isClose(movingPoints.right, staticPoints.right, threshold)) {
    guides.push(createVerticalGuide(
      `right-${staticElement.id}`,
      staticPoints.right,
      startY,
      endY
    ));
  }
  
  // Bord gauche avec bord droit
  if (isClose(movingPoints.left, staticPoints.right, threshold)) {
    guides.push(createVerticalGuide(
      `leftright-${staticElement.id}`,
      staticPoints.right,
      startY,
      endY
    ));
  }
  
  // Bord droit avec bord gauche
  if (isClose(movingPoints.right, staticPoints.left, threshold)) {
    guides.push(createVerticalGuide(
      `rightleft-${staticElement.id}`,
      staticPoints.left,
      startY,
      endY
    ));
  }
  
  return guides;
}

/**
 * Détecte tous les guides d'alignement pour un élément en mouvement
 * par rapport à un ensemble d'éléments statiques
 */
export function detectAlignmentGuides(
  movingElement: AnyPlanElement,
  otherElements: AnyPlanElement[],
  threshold: number = ALIGNMENT_THRESHOLD
): AlignmentGuide[] {
  const guides: AlignmentGuide[] = [];
  
  // Vérifier l'alignement avec chaque élément statique
  for (const element of otherElements) {
    if (element.id === movingElement.id) continue;
    
    // Ajouter les guides horizontaux et verticaux
    guides.push(...detectHorizontalGuides(movingElement, element, threshold));
    guides.push(...detectVerticalGuides(movingElement, element, threshold));
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
  if (guides.length === 0) return position;
  
  let { x, y } = position;
  const points = getElementAlignmentPoints({
    ...element,
    bounds: {
      ...element.bounds,
      x,
      y
    }
  });
  
  // Vérifier chaque guide pour un possible alignement
  for (const guide of guides) {
    if (guide.type === 'horizontal') {
      // Alignement sur guides horizontaux
      if (isClose(points.top, guide.position)) {
        y = guide.position;
      } else if (isClose(points.middle, guide.position)) {
        y = guide.position - element.bounds.height / 2;
      } else if (isClose(points.bottom, guide.position)) {
        y = guide.position - element.bounds.height;
      }
    } else {
      // Alignement sur guides verticaux
      if (isClose(points.left, guide.position)) {
        x = guide.position;
      } else if (isClose(points.center, guide.position)) {
        x = guide.position - element.bounds.width / 2;
      } else if (isClose(points.right, guide.position)) {
        x = guide.position - element.bounds.width;
      }
    }
  }
  
  return { x, y };
}