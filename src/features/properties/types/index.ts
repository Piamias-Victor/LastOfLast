import { ElementType, RectangleElement } from '@/types/elements';

/**
 * Interface pour les props du hook usePropertyEdit
 */
export interface UsePropertyEditProps {
  initialValue: string | number;
  onUpdate: (value: string | number) => void;
}

/**
 * Interface pour le résultat du hook usePropertyEdit
 */
export interface UsePropertyEditResult {
  isEditing: boolean;
  editValue: string;
  startEditing: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * Interface pour les props du champ éditable
 */
export interface EditableFieldProps {
  label: string;
  value: string | number;
  onUpdate: (value: string | number) => void;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * Interface pour les props de l'affichage de couleur
 */
export interface ColorDisplayProps {
  label: string;
  color: string;
  className?: string;
}

/**
 * Interface pour les props du groupe de propriétés
 */
export interface PropertyGroupProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Interface pour les props du panneau rectangle
 */
export interface RectanglePropertiesPanelProps {
  element: RectangleElement;
  updateElement: (id: string, updates: Partial<RectangleElement>) => void;
}

/**
 * Interface pour les props du panneau multi-sélection
 */
export interface MultiSelectionPanelProps {
  selectedCount: number;
  elementTypes: ElementType[];
}