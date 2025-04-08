import { create } from 'zustand';
import { produce } from 'immer';
import { ResizeHandle, Vector2D } from '@/types/geometry';
import { generateId } from '@/lib/utils';
import { AnyPlanElement, BasePlanElement } from '@/types/elements';

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
 * État de l'éditeur
 */
export interface EditorState {
  /** Les éléments actuellement dans le plan */
  elements: AnyPlanElement[];
  /** IDs des éléments sélectionnés */
  selectedElementIds: string[];
  /** Opération en cours sur les éléments */
  currentOperation: ElementOperation;
  /** Position de départ du pointeur lors d'une opération */
  operationStartPoint: Vector2D | null;
  /** Poignée de redimensionnement actuellement utilisée */
  activeResizeHandle: ResizeHandle | null;
  /** Mode grille activé */
  gridEnabled: boolean;
  /** Taille de la grille en pixels */
  gridSize: number;
  /** Zoom actuel */
  zoom: number;
  /** Décalage du viewport */
  viewportOffset: Vector2D;
  /** L'élément est-il magnétisé à la grille */
  snapToGrid: boolean;
}

/**
 * Actions du store
 */
export interface EditorActions {
  // Actions pour manipuler les éléments
  addElement: (element: Omit<AnyPlanElement, 'id'>) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<BasePlanElement>) => void;
  selectElement: (id: string) => void;
  deselectElement: (id: string) => void;
  deselectAll: () => void;
  selectAll: () => void;
  
  // Actions pour les opérations
  startOperation: (
    operation: ElementOperation,
    startPoint: Vector2D,
    resizeHandle?: ResizeHandle | null
  ) => void;
  endOperation: () => void;
  
  // Actions pour le canvas
  setZoom: (zoom: number) => void;
  setViewportOffset: (offset: Vector2D) => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;
}

/**
 * État initial de l'éditeur
 */
const initialState: EditorState = {
  elements: [],
  selectedElementIds: [],
  currentOperation: ElementOperation.None,
  operationStartPoint: null,
  activeResizeHandle: null,
  gridEnabled: true,
  gridSize: 20,
  zoom: 1,
  viewportOffset: { x: 0, y: 0 },
  snapToGrid: true,
};

/**
 * Store Zustand pour gérer l'état de l'éditeur
 */
export const useEditorStore = create<EditorState & EditorActions>((set) => ({
  ...initialState,

  addElement: (element) =>
    set(
      produce((state: EditorState) => {
        const newElement = {
          ...element,
          id: generateId(),
        } as AnyPlanElement;
        state.elements.push(newElement);
      })
    ),

  removeElement: (id) =>
    set(
      produce((state: EditorState) => {
        state.elements = state.elements.filter((el) => el.id !== id);
        state.selectedElementIds = state.selectedElementIds.filter(
          (selectedId) => selectedId !== id
        );
      })
    ),

  updateElement: (id, updates) =>
    set(
      produce((state: EditorState) => {
        const index = state.elements.findIndex((el) => el.id === id);
        if (index !== -1) {
          // Conserver le type de l'élément
          const element = state.elements[index];
          // Mise à jour de l'élément avec type guard approprié
          state.elements[index] = {
            ...element,
            ...updates,
            // S'assurer que le type n'est pas modifié
            type: element.type
          } as AnyPlanElement;
        }
      })
    ),

  selectElement: (id) =>
    set(
      produce((state: EditorState) => {
        if (!state.selectedElementIds.includes(id)) {
          state.selectedElementIds.push(id);
        }
      })
    ),

  deselectElement: (id) =>
    set(
      produce((state: EditorState) => {
        state.selectedElementIds = state.selectedElementIds.filter(
          (selectedId) => selectedId !== id
        );
      })
    ),

  deselectAll: () =>
    set(
      produce((state: EditorState) => {
        state.selectedElementIds = [];
      })
    ),

  selectAll: () =>
    set(
      produce((state: EditorState) => {
        state.selectedElementIds = state.elements.map((el) => el.id);
      })
    ),

  startOperation: (operation, startPoint, resizeHandle = null) =>
    set(
      produce((state: EditorState) => {
        state.currentOperation = operation;
        state.operationStartPoint = startPoint;
        state.activeResizeHandle = resizeHandle;
      })
    ),

  endOperation: () =>
    set(
      produce((state: EditorState) => {
        state.currentOperation = ElementOperation.None;
        state.operationStartPoint = null;
        state.activeResizeHandle = null;
      })
    ),

  setZoom: (zoom) =>
    set(
      produce((state: EditorState) => {
        state.zoom = zoom;
      })
    ),

  setViewportOffset: (offset) =>
    set(
      produce((state: EditorState) => {
        state.viewportOffset = offset;
      })
    ),

  toggleGrid: () =>
    set(
      produce((state: EditorState) => {
        state.gridEnabled = !state.gridEnabled;
      })
    ),

  toggleSnapToGrid: () =>
    set(
      produce((state: EditorState) => {
        state.snapToGrid = !state.snapToGrid;
      })
    ),
}));