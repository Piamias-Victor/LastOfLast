'use client';

import React from 'react';
import { EditorWrapperProps } from '../types';
import { cn } from '@/lib/utils';

/**
 * Composant wrapper pour l'éditeur
 */
const EditorWrapper: React.FC<EditorWrapperProps> = ({ 
  children,
  className 
}) => {
  return (
    <div className={cn("flex h-full w-full flex-col", className)}>
      {children}
    </div>
  );
};

export default EditorWrapper;