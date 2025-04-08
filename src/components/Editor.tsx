'use client';

import React, { useEffect, useRef, useState } from 'react';
import SimpleCanvas from './canvas/SimpleCanvas';
import { useEditorStore } from '@/states/editorStore';

const Editor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
  const { 
    toggleGrid, 
    toggleSnapToGrid, 
    gridEnabled, 
    snapToGrid,
    elements,
    selectedElementIds,
    deselectAll
  } = useEditorStore();

  // Observer les changements de taille du conteneur
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

  // Ajouter des raccourcis clavier pour la sélection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Échap pour désélectionner tout
      if (e.key === 'Escape') {
        deselectAll();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [deselectAll]);

  return (
    <div className="flex h-full w-full flex-col">
      {/* Barre d'outils supérieure */}
      <div className="flex h-10 items-center justify-between border-b px-4 bg-gray-100 shadow-sm">
        <div className="flex space-x-4">
          <button
            className={`text-xs px-3 py-1 rounded-md transition-colors ${
              gridEnabled 
                ? 'bg-pharmacy-primary text-white shadow-sm' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            onClick={toggleGrid}
          >
            Grille {gridEnabled ? 'On' : 'Off'}
          </button>
          <button
            className={`text-xs px-3 py-1 rounded-md transition-colors ${
              snapToGrid 
                ? 'bg-pharmacy-primary text-white shadow-sm' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            onClick={toggleSnapToGrid}
          >
            Aimanter {snapToGrid ? 'On' : 'Off'}
          </button>
        </div>
        
        {/* Information sur les éléments */}
        <div className="flex items-center space-x-4">
          <div className="text-xs text-gray-500">
            {elements.length} élément(s) | {selectedElementIds.length} sélectionné(s)
          </div>
          
          {selectedElementIds.length > 0 && (
            <button
              className="text-xs px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
              onClick={deselectAll}
            >
              Désélectionner tout
            </button>
          )}
        </div>
      </div>
      
      {/* Conteneur du canvas */}
      <div ref={containerRef} className="flex-grow overflow-hidden bg-gray-50">
        {containerSize.width > 0 && containerSize.height > 0 && (
          <SimpleCanvas width={containerSize.width} height={containerSize.height} />
        )}
      </div>
      
      {/* Indications des raccourcis clavier */}
      <div className="text-xs p-2 bg-gray-100 border-t text-gray-500 flex justify-between">
        <div>
          <span className="font-medium">Raccourcis :</span> Échap = Désélectionner, Shift+Clic = Sélection multiple
        </div>
        <div>
          <span className="font-medium">Sélection :</span> Cliquez et glissez dans un espace vide pour sélectionner plusieurs éléments
        </div>
      </div>
    </div>
  );
};

export default Editor;