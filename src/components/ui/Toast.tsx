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
    info: 'bg-pharmacy-primary/90 backdrop-blur-sm',
    success: 'bg-pharmacy-success/90 backdrop-blur-sm',
    warning: 'bg-pharmacy-warning/90 backdrop-blur-sm',
    error: 'bg-pharmacy-danger/90 backdrop-blur-sm'
  };
  
  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300',
        typeClasses[type],
        visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      )}
    >
      <div className="flex items-center">
        <span className="text-sm font-medium">{message}</span>
        <button
          className="ml-6 text-white/70 hover:text-white/100 transition-opacity"
          onClick={closeToast}
          aria-label="Fermer"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast;