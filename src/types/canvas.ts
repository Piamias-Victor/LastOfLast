/**
 * Interface pour les dimensions du canvas
 */
export interface CanvasDimensions {
    /** Largeur du canvas en pixels */
    width: number;
    /** Hauteur du canvas en pixels */
    height: number;
  }
  
  /**
   * Interface pour les formats prédéfinis
   */
  export interface PresetCanvasSize {
    /** Nom du format prédéfini */
    name: string;
    /** Largeur du format prédéfini en pixels */
    width: number;
    /** Hauteur du format prédéfini en pixels */
    height: number;
    /** Description du format prédéfini */
    description?: string;
  }
  
  /**
   * Type pour les unités de mesure du canvas
   */
  export type CanvasUnit = 'px' | 'cm' | 'm';
  
  /**
   * Interface pour les propriétés d'état des dimensions du canvas
   */
  export interface CanvasDimensionsStateProps {
    /** Dimensions actuelles du canvas */
    canvasDimensions: CanvasDimensions;
    /** Unité de mesure actuelle */
    canvasUnit: CanvasUnit;
    /** Facteur de conversion entre pixels et unités réelles */
    pixelsPerUnit: number;
  }
  
  /**
   * Interface pour les actions de l'état des dimensions du canvas
   */
  export interface CanvasDimensionsStateActions {
    /** Définit les dimensions du canvas */
    setCanvasDimensions: (dimensions: CanvasDimensions) => void;
    /** Définit l'unité de mesure */
    setCanvasUnit: (unit: CanvasUnit) => void;
    /** Définit le facteur de conversion */
    setPixelsPerUnit: (factor: number) => void;
  }
  
  /**
   * Type complet de l'état des dimensions du canvas (props + actions)
   */
  export type CanvasDimensionsState = CanvasDimensionsStateProps & CanvasDimensionsStateActions;