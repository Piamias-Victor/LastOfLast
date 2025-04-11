import { StateCreator } from 'zustand';
import { produce } from 'immer';
import { RootState } from '../types';
import { ClipboardState } from '../types/clipboard';
import { AnyPlanElement } from '@/types/elements';
import { generateId } from '@/lib/utils/index';

/**
 * Valeurs initiales pour l'état du presse-papier
 */
export const initialClipboardState: ClipboardState = {
  copiedElements: [],
  
  // Actions sont définies dans la création du slice
  copySelectedElements: () => {},
  pasteElements: () => {},
  cutSelectedElements: () => {},
};

/**
 * Décalage à appliquer lors de la création d'éléments collés
 */
const PASTE_OFFSET = 20;

/**
 * Créateur de slice pour l'état du presse-papier
 */
export const createClipboardSlice: StateCreator<RootState, [], [], ClipboardState> = (set, get) => ({
  ...initialClipboardState,

  copySelectedElements: () =>
    set(
      produce((state: RootState) => {
        const selectedIds = state.selectedElementIds;
        if (selectedIds.length === 0) return;
        
        // Trouver les éléments sélectionnés
        const selectedElements = state.elements.filter(element => 
          selectedIds.includes(element.id)
        );
        
        // Copier les éléments dans le presse-papier
        state.copiedElements = JSON.parse(JSON.stringify(selectedElements));
      })
    ),

  pasteElements: () =>
    set(
      produce((state: RootState) => {
        if (state.copiedElements.length === 0) return;
        
        // Créer de nouveaux éléments à partir des éléments copiés
        const newElements: AnyPlanElement[] = [];
        
        // Générer de nouveaux IDs et décaler légèrement les positions
        state.copiedElements.forEach(element => {
          const newElement = {
            ...JSON.parse(JSON.stringify(element)), // Deep clone
            id: generateId(),
            bounds: {
              ...element.bounds,
              x: element.bounds.x + PASTE_OFFSET,
              y: element.bounds.y + PASTE_OFFSET
            },
            transform: {
              ...element.transform,
              position: {
                x: element.transform.position.x + PASTE_OFFSET,
                y: element.transform.position.y + PASTE_OFFSET
              }
            }
          };
          
          newElements.push(newElement);
        });
        
        // Ajouter les nouveaux éléments au plan
        state.elements.push(...newElements);
        
        // Sélectionner les nouveaux éléments
        state.selectedElementIds = newElements.map(element => element.id);
      })
    ),

  cutSelectedElements: () =>
    set(
      produce((state: RootState) => {
        const selectedIds = state.selectedElementIds;
        if (selectedIds.length === 0) return;
        
        // Trouver les éléments sélectionnés
        const selectedElements = state.elements.filter(element => 
          selectedIds.includes(element.id)
        );
        
        // Copier les éléments dans le presse-papier
        state.copiedElements = JSON.parse(JSON.stringify(selectedElements));
        
        // Supprimer les éléments sélectionnés
        state.elements = state.elements.filter(element => 
          !selectedIds.includes(element.id)
        );
        
        // Vider la sélection
        state.selectedElementIds = [];
      })
    ),
});