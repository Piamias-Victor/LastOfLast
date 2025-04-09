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
  END_CAP = 'end_cap', // Tête de gondole
  BARGAIN_BIN = 'bargain_bin', // Bac soldeur
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
 * Interface pour un comptoir
 */
export interface CounterElement extends BasePlanElement {
  type: ElementType.COUNTER;
  stations: number; // Nombre de postes de travail
  hasStorage: boolean; // Possède un espace de stockage
  counterHeight: number; // Hauteur du comptoir en cm
  isAccessible: boolean; // Accessible PMR
  backgroundColor: string;
  borderColor?: string;
  borderWidth?: number;
}

/**
 * Interface pour une gondole/rayon
 */
export interface GondolaElement extends BasePlanElement {
  type: ElementType.GONDOLA;
  shelfCount: number; // Nombre d'étagères
  shelfHeight: number; // Hauteur d'une étagère en cm
  shelfDepth: number; // Profondeur d'une étagère en cm
  doubleSided: boolean; // Rayon accessible des deux côtés
  backgroundColor: string;
  borderColor?: string;
  borderWidth?: number;
  rackColor?: string; // Couleur des étagères
}

/**
 * Interface pour une tête de gondole
 */
export interface EndCapElement extends BasePlanElement {
  type: ElementType.END_CAP;
  shelfCount: number; // Nombre d'étagères
  shelfHeight: number; // Hauteur d'une étagère en cm
  shelfDepth: number; // Profondeur d'une étagère en cm
  isPremium: boolean; // Emplacement premium (mise en valeur)
  backgroundColor: string;
  borderColor?: string;
  borderWidth?: number;
  highlightColor?: string; // Couleur de mise en valeur
}

/**
 * Interface pour un bac soldeur
 */
export interface BargainBinElement extends BasePlanElement {
  type: ElementType.BARGAIN_BIN;
  depth: number; // Profondeur du bac en cm
  isRound: boolean; // Forme ronde ou rectangulaire
  hasSignage: boolean; // Affichage promotionnel
  backgroundColor: string;
  borderColor?: string;
  borderWidth?: number;
  discountLabel?: string; // Texte de promotion (ex: "-50%")
}

/**
 * Type d'union pour tous les éléments possibles
 */
export type AnyPlanElement = 
  | RectangleElement
  | WallElement
  | DoorElement
  | CounterElement
  | GondolaElement
  | EndCapElement
  | BargainBinElement;

/**
 * Interface pour un élément générique
 */
export type PlanElement = BasePlanElement;