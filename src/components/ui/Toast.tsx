'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onClose?: () => void;
}

/**
 * Composant de notification toast
 */
const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose
}) => {
  const [visible, setVisible] = useState(true);
  
  // Gérer l'animation de fermeture
  const closeToast = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      onClose && onClose();
    }, 300); // Durée de l'animation
  }, [onClose]);
  
  // Fermer automatiquement après la durée spécifiée
  useEffect(() => {
    const timer = setTimeout(() => {
      closeToast();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, closeToast]);
  
  // Couleurs selon le type
  const typeClasses = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };
  
  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white transform transition-all duration-300',
        typeClasses[type],
        visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      )}
    >
      <div className="flex items-center">
        <span>{message}</span>
        <button
          className="ml-4 text-white opacity-70 hover:opacity-100"
          onClick={closeToast}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast;