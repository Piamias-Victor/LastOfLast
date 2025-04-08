'use client';

import { useState, useCallback, useEffect } from 'react';
import { UsePropertyEditProps, UsePropertyEditResult } from '../types';

/**
 * Hook pour gérer l'édition de propriétés
 */
export function usePropertyEdit({
  initialValue,
  onUpdate
}: UsePropertyEditProps): UsePropertyEditResult {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>(String(initialValue ?? ''));

  // Mettre à jour editValue lorsque initialValue change
  useEffect(() => {
    if (!isEditing) {
      setEditValue(String(initialValue ?? ''));
    }
  }, [initialValue, isEditing]);

  const startEditing = useCallback(() => {
    setEditValue(String(initialValue ?? ''));
    setIsEditing(true);
  }, [initialValue]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  }, []);

  const finishEditing = useCallback(() => {
    setIsEditing(false);
    
    // Convertir en nombre si nécessaire
    const numValue = parseFloat(editValue);
    
    if (!isNaN(numValue)) {
      onUpdate(numValue);
    }
  }, [editValue, onUpdate]);

  const handleBlur = useCallback(() => {
    finishEditing();
  }, [finishEditing]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      finishEditing();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  }, [finishEditing]);

  return {
    isEditing,
    editValue,
    startEditing,
    handleChange,
    handleBlur,
    handleKeyDown
  };
}