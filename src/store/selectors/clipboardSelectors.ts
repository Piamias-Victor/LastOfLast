import { RootState } from '../types';

/**
 * Sélectionne les éléments copiés dans le presse-papier
 */
export const selectCopiedElements = (state: RootState) => state.copiedElements;

/**
 * Vérifie si le presse-papier contient des éléments
 */
export const selectHasCopiedElements = (state: RootState) => state.copiedElements.length > 0;