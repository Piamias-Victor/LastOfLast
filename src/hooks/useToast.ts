'use client';

import { useState, useCallback } from 'react';
import { ToastItem } from '@/components/ui/ToastContainer';

/**
 * Hook pour gérer les notifications toast
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  
  // Ajoute un nouveau toast
  const addToast = useCallback((
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    duration: number = 3000
  ) => {
    const id = Math.random().toString(36).substring(2);
    
    setToasts(prev => [...prev, {
      id,
      message,
      type,
      duration
    }]);
    
    // Supprimer automatiquement après la durée + animation
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration + 300);
    
    return id;
  }, []);
  
  // Supprime un toast par son ID
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  
  return {
    toasts,
    addToast,
    removeToast
  };
}