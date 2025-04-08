import { Bounds, Transform, Vector2D } from './geometry';

/**
 * Types d'éléments possibles dans le plan
 */
export enum ElementType {
  RECTANGLE = 'rectangle',
  GONDOLA = 'gondola',
  COUNTER = 'counter',
  DISPLAY = 'display',
  CABINET = 'cabinet',
  WALL = 'wall',
  DOOR = 'door',
}

/**
 * Métadonnées de base pour tous les éléments
 */
export interface ElementMetadata {
  name: string;
  manufacturer?: string;
  model?: string;
  price?: number;
  color?: string;
  material?: string;
  customProperties: Record<string, unknown>;
}

/**
 * Interface de base pour tous les éléments du plan
 */
export interface BasePlanElement {
  id: string;
  type: ElementType;
  bounds: Bounds;
  transform: Transform;
  zIndex: number;
  isLocked: boolean;
  isVisible: boolean;
  isSelected: boolean;
  metadata: ElementMetadata;
}

/**
 * Interface pour un élément rectangulaire simple
 */
export interface RectangleElement extends BasePlanElement {
  type: ElementType.RECTANGLE;
  cornerRadius?: number;
  backgroundColor: string;
  borderColor?: string;
  borderWidth?: number;
}

/**
 * Interface pour un mur
 */
export interface WallElement extends BasePlanElement {
  type: ElementType.WALL;
  thickness: number;
  start: Vector2D;
  end: Vector2D;
  isStructural: boolean;
}

/**
 * Interface pour une porte
 */
export interface DoorElement extends BasePlanElement {
  type: ElementType.DOOR;
  wallId: string;
  width: number;
  isAutomatic: boolean;
}

/**
 * Type d'union pour tous les éléments possibles
 */
export type AnyPlanElement = 
  | RectangleElement
  | WallElement
  | DoorElement;

/**
 * Interface pour un élément générique
 */
export type PlanElement = BasePlanElement;