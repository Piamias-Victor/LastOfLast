import { RootState } from '../types';

/**
 * Sélectionne l'opération en cours
 */
export const selectCurrentOperation = (state: RootState) => state.currentOperation;

/**
 * Sélectionne le point de départ de l'opération
 */
export const selectOperationStartPoint = (state: RootState) => state.operationStartPoint;

/**
 * Sélectionne la poignée de redimensionnement active
 */
export const selectActiveResizeHandle = (state: RootState) => state.activeResizeHandle;

/**
 * Vérifie si une opération est en cours
 */
export const selectIsOperationActive = (state: RootState) => state.currentOperation !== 'none';