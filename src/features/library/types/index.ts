import { ElementType } from '@/types/elements';

/**
 * Props pour un élément de la bibliothèque
 */
export interface LibraryItemProps {
  type: ElementType;
  name: string;
  description: string;
  icon: string;
}

/**
 * Données transférées lors du drag & drop
 */
export interface DragData {
  type: ElementType;
  width: number;
  height: number;
}