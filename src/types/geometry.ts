/**
 * Représente un point en 2D avec des coordonnées x et y
 */
export interface Vector2D {
    x: number;
    y: number;
  }
  
  /**
   * Représente les dimensions d'un élément avec largeur et hauteur
   */
  export interface Dimensions {
    width: number;
    height: number;
  }
  
  /**
   * Représente les limites d'un élément avec position et dimensions
   */
  export interface Bounds extends Vector2D, Dimensions {}
  
  /**
   * Représente la transformation d'un élément
   */
  export interface Transform {
    position: Vector2D;
    rotation: number;
    scale: Vector2D;
  }
  
  /**
   * Direction d'une poignée de redimensionnement
   */
  export enum ResizeHandle {
    TopLeft = 'topLeft',
    Top = 'top',
    TopRight = 'topRight',
    Right = 'right',
    BottomRight = 'bottomRight',
    Bottom = 'bottom',
    BottomLeft = 'bottomLeft',
    Left = 'left',
  }
  
  /**
   * Opérations possibles sur un élément
   */
  export enum ElementOperation {
    None = 'none',
    Move = 'move',
    Resize = 'resize',
    Rotate = 'rotate',
  }