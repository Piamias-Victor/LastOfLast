import { useState, useCallback } from 'react';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  message: string;
  type: NotificationType;
}

interface CanvasNotificationsResult {
  toast: Notification | null;
  showToast: (message: string, type: NotificationType) => void;
  hideToast: () => void;
}

/**
 * Hook pour gérer les notifications du canvas
 */
export function useCanvasNotifications(): CanvasNotificationsResult {
  const [toast, setToast] = useState<Notification | null>(null);
  
  const showToast = useCallback((message: string, type: NotificationType) => {
    setToast({ message, type });
    
    // Auto-hide après un délai
    setTimeout(() => {
      setToast(null);
    }, 2000);
  }, []);
  
  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return { toast, showToast, hideToast };
}