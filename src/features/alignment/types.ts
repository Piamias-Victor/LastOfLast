import { Vector2D } from '@/types/geometry';
import { AnyPlanElement } from '@/types/elements';

/**
 * Types d'alignement horizontal
 */
export enum HorizontalAlignment {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

/**
 * Types d'alignement vertical
 */
export enum VerticalAlignment {
  TOP = 'top',
  MIDDLE = 'middle',
  BOTTOM = 'bottom',
}

/**
 * Résultat d'une opération d'alignement
 */
export interface AlignmentResult {
  elementId: string;
  oldPosition: Vector2D;
  newPosition: Vector2D;
}

/**
 * Ligne de guide d'alignement
 */
export interface AlignmentGuide {
  id: string;
  type: 'horizontal' | 'vertical';
  position: number; // Position en pixels
  start: number; // Point de début
  end: number; // Point de fin
}

/**
 * Contexte d'alignement
 */
export interface AlignmentContext {
  selectedElements: AnyPlanElement[];
  targetElements: AnyPlanElement[];
  activeGuides: AlignmentGuide[];
}