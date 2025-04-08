import { StateCreator } from 'zustand';
import { produce } from 'immer';
import { RootState } from '../types';
import { ElementsState } from '../types/elements';
import { generateId } from '@/lib/utils';
import { AnyPlanElement } from '@/types/elements';

/**
 * Valeurs initiales pour l'état des éléments
 */
export const initialElementsState: ElementsState = {
  elements: [],
  selectedElementIds: [],
  
  // Actions sont définies dans la création du slice
  addElement: () => {},
  removeElement: () => {},
  updateElement: () => {},
  selectElement: () => {},
  deselectElement: () => {},
  deselectAll: () => {},
  selectAll: () => {}
};

/**
 * Créateur de slice pour l'état des éléments
 */
export const createElementsSlice: StateCreator<RootState, [], [], ElementsState> = (set) => ({
  ...initialElementsState,

  addElement: (element) =>
    set(
      produce((state: RootState) => {
        const newElement = {
          ...element,
          id: generateId(),
        } as AnyPlanElement;
        state.elements.push(newElement);
      })
    ),

  removeElement: (id) =>
    set(
      produce((state: RootState) => {
        state.elements = state.elements.filter((el) => el.id !== id);
        state.selectedElementIds = state.selectedElementIds.filter(
          (selectedId) => selectedId !== id
        );
      })
    ),

  updateElement: (id, updates) =>
    set(
      produce((state: RootState) => {
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
      produce((state: RootState) => {
        if (!state.selectedElementIds.includes(id)) {
          state.selectedElementIds.push(id);
        }
      })
    ),

  deselectElement: (id) =>
    set(
      produce((state: RootState) => {
        state.selectedElementIds = state.selectedElementIds.filter(
          (selectedId) => selectedId !== id
        );
      })
    ),

  deselectAll: () =>
    set(
      produce((state: RootState) => {
        state.selectedElementIds = [];
      })
    ),

  selectAll: () =>
    set(
      produce((state: RootState) => {
        state.selectedElementIds = state.elements.map((el) => el.id);
      })
    ),
});