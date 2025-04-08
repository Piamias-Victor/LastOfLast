'use client';

import React from 'react';
import { KeyboardShortcutsProps } from '../types';
import { useEditorKeyboardShortcuts } from '../hooks/useEditorKeyboardShortcuts';

/**
 * Composant invisible qui gère les raccourcis clavier de l'éditeur
 */
const EditorKeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ 
  onDeselectAll 
}) => {
  // Initialiser les raccourcis clavier
  useEditorKeyboardShortcuts(onDeselectAll);
  
  // Ce composant ne rend rien
  return null;
};

export default EditorKeyboardShortcuts;