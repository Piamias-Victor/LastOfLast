'use client';

import React, { useState, useCallback } from 'react';
import Toast from './Toast';

// Type d'une notification toast
export interface ToastItem {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/**
 * Container pour les notifications toast
 */
const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'bottom-right'
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  
  // Supprime un toast par son ID
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  
  // Positionner le container selon l'option choisie
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };
  
  return (
    <div className={`fixed ${positionClasses[position]} z-50 flex flex-col gap-2`}>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;