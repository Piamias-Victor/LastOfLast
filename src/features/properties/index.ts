// Composants
export { default as PropertiesPanel } from './components/PropertiesPanel';
export { default as RectanglePropertiesPanel } from './components/RectanglePropertiesPanel';
export { default as CounterPropertiesPanel } from './components/CounterPropertiesPanel';
export { default as GondolaPropertiesPanel } from './components/GondolaPropertiesPanel';
export { default as EndCapPropertiesPanel } from './components/EndCapPropertiesPanel';
export { default as BargainBinPropertiesPanel } from './components/BargainBinPropertiesPanel';
export { default as MultiSelectionPanel } from './components/MultiSelectionPanel';
export { default as NoSelectionPanel } from './components/NoSelectionPanel';

// Hooks
export { usePropertyEdit } from './hooks/usePropertyEdit';

// Types
export type {
  EditableFieldProps,
  ColorDisplayProps,
  PropertyGroupProps,
  RectanglePropertiesPanelProps,
  MultiSelectionPanelProps,
  UsePropertyEditProps,
  UsePropertyEditResult
} from './types';