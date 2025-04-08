import { StateCreator } from 'zustand';
import { produce } from 'immer';
import { RootState } from '../types';
import { OperationsState, ElementOperation } from '../types/operations';

/**
 * Valeurs initiales pour l'état des opérations
 */
export const initialOperationsState: OperationsState = {
  currentOperation: ElementOperation.None,
  operationStartPoint: null,
  activeResizeHandle: null,
  
  // Actions sont définies dans la création du slice
  startOperation: () => {},
  endOperation: () => {}
};

/**
 * Créateur de slice pour l'état des opérations
 */
export const createOperationsSlice: StateCreator<RootState, [], [], OperationsState> = (set) => ({
  ...initialOperationsState,

  startOperation: (operation, startPoint, resizeHandle = null) =>
    set(
      produce((state: RootState) => {
        state.currentOperation = operation;
        state.operationStartPoint = startPoint;
        state.activeResizeHandle = resizeHandle;
      })
    ),

  endOperation: () =>
    set(
      produce((state: RootState) => {
        state.currentOperation = ElementOperation.None;
        state.operationStartPoint = null;
        state.activeResizeHandle = null;
      })
    ),
});