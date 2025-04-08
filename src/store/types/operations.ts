import { Vector2D } from '@/types/geometry';
import { ResizeHandle } from '@/types/geometry';

/**
 * Opérations possibles sur un élément
 */
export enum ElementOperation {
  None = 'none',
  Move = 'move',
  Resize = 'resize',
  Rotate = 'rotate',
}

/**
 * Propriétés d'état des opérations
 */
export interface OperationsStateProps {
  /** Opération en cours sur les éléments */
  currentOperation: ElementOperation;
  
  /** Position de départ du pointeur lors d'une opération */
  operationStartPoint: Vector2D | null;
  
  /** Poignée de redimensionnement actuellement utilisée */
  activeResizeHandle: ResizeHandle | null;
}

/**
 * Actions disponibles pour les opérations
 */
export interface OperationsStateActions {
  /** Démarre une opération sur un élément */
  startOperation: (
    operation: ElementOperation,
    startPoint: Vector2D,
    resizeHandle?: ResizeHandle | null
  ) => void;
  
  /** Termine l'opération en cours */
  endOperation: () => void;
}

/**
 * Type complet de l'état des opérations (props + actions)
 */
export type OperationsState = OperationsStateProps & OperationsStateActions;