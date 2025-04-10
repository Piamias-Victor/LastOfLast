import { AnyPlanElement } from '@/types/elements';

/**
 * Seuil de proximité pour l'alignement automatique (en pixels)
 */
export const ALIGNMENT_THRESHOLD = 5;

/**
 * Définit les points d'alignement importants d'un élément
 */
export interface ElementAlignmentPoints {
  left: number;
  center: number;
  right: number;
  top: number;
  middle: number;
  bottom: number;
}

/**
 * Calcule les points d'alignement d'un élément
 */
export function getElementAlignmentPoints(element: AnyPlanElement): ElementAlignmentPoints {
  const { bounds } = element;
  
  return {
    left: bounds.x,
    center: bounds.x + bounds.width / 2,
    right: bounds.x + bounds.width,
    top: bounds.y,
    middle: bounds.y + bounds.height / 2,
    bottom: bounds.y + bounds.height
  };
}

/**
 * Vérifie si deux nombres sont proches dans la limite du seuil
 */
export function isClose(value1: number, value2: number, threshold: number = ALIGNMENT_THRESHOLD): boolean {
  return Math.abs(value1 - value2) < threshold;
}