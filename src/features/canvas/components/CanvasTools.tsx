'use client';

import React from 'react';

interface CanvasToolsProps {
  gridEnabled: boolean;
  toggleGrid: () => void;
  snapToGrid: boolean;
  toggleSnapToGrid: () => void;
  elementsCount: number;
  selectedCount: number;
  onDeselectAll: () => void;
  onDeleteSelected: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onCut: () => void;
}

/**
 * Barre d'outils pour le canvas
 */
const CanvasTools: React.FC<CanvasToolsProps> = ({
  gridEnabled,
  toggleGrid,
  snapToGrid,
  toggleSnapToGrid,
  elementsCount,
  selectedCount,
  onDeselectAll,
  onDeleteSelected,
  onCopy,
  onPaste,
  onCut
}) => {
  // Déterminer le raccourci selon la plateforme
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const ctrlKey = isMac ? '⌘' : 'Ctrl';
  
  return (
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
          {elementsCount} élément(s) | {selectedCount} sélectionné(s)
        </div>
        
        {selectedCount > 0 && (
          <div className="flex space-x-2">
            <button
              className="text-xs px-3 py-1 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              onClick={onCopy}
              title={`Copier (${ctrlKey}+C)`}
            >
              Copier
            </button>
            <button
              className="text-xs px-3 py-1 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white transition-colors"
              onClick={onCut}
              title={`Couper (${ctrlKey}+X)`}
            >
              Couper
            </button>
            <button
              className="text-xs px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors"
              onClick={onDeleteSelected}
              title="Supprimer (Delete)"
            >
              Supprimer
            </button>
            <button
              className="text-xs px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
              onClick={onDeselectAll}
            >
              Désélectionner
            </button>
          </div>
        )}
        
        <button
          className="text-xs px-3 py-1 rounded-md bg-green-500 hover:bg-green-600 text-white transition-colors"
          onClick={onPaste}
          title={`Coller (${ctrlKey}+V)`}
        >
          Coller
        </button>
      </div>
    </div>
  );
};

export default CanvasTools;