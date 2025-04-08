'use client';

import React from 'react';
import { useEditorStore } from '@/store';
import { Canvas } from '@/features/canvas/components';
import { EditorProps } from '../types';
import { useEditorResize } from '../hooks/useEditorResize';
import EditorKeyboardShortcuts from './EditorKeyboardShortcuts';
import EditorWrapper from './EditorWrapper';

/**
 * Composant principal de l'éditeur
 */
const Editor: React.FC<EditorProps> = ({ className }) => {
  // State et actions de l'éditeur
  const { deselectAll } = useEditorStore();
  
  // Gestion du redimensionnement
  const [containerRef, containerSize] = useEditorResize();
  
  return (
    <EditorWrapper className={className}>
      {/* Gestionnaire de raccourcis clavier */}
      <EditorKeyboardShortcuts onDeselectAll={deselectAll} />
      
      {/* Conteneur du canvas */}
      <div ref={containerRef} className="flex-grow overflow-hidden bg-gray-50">
        {containerSize.width > 0 && containerSize.height > 0 && (
          <Canvas 
            width={containerSize.width} 
            height={containerSize.height} 
          />
        )}
      </div>
    </EditorWrapper>
  );
};

export default Editor;