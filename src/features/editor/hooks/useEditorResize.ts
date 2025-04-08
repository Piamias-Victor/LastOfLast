'use client';

import { useRef, useState, useEffect } from 'react';
import { ContainerSize } from '../types';

/**
 * Hook pour gérer le redimensionnement du conteneur de l'éditeur
 */
export function useEditorResize(): [React.RefObject<HTMLDivElement>, ContainerSize] {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<ContainerSize>({ width: 0, height: 0 });
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    
    // Mettre à jour la taille initiale
    updateSize();
    
    // Observer les changements de taille
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);
    
    // Variable pour éviter une fuite mémoire dans le cleanup
    const currentRef = containerRef.current;
    
    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
    };
  }, []);
  
  return [containerRef, containerSize];
}