// src/features/canvas/components/CanvasTools.tsx (modification)
'use client';

import React from 'react';
import CanvasSizeDialog from './dimensions/CanvasSizeDialog';

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
    <div className="flex h-12 items-center justify-between border-b border-gray-100/80 px-6 py-2 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="flex space-x-3">
        <button
          className={`text-xs px-4 py-1.5 rounded-full transition-colors ${
            gridEnabled 
              ? 'bg-pharmacy-primary/10 text-pharmacy-primary' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          onClick={toggleGrid}
        >
          Grille {gridEnabled ? 'On' : 'Off'}
        </button>
        <button
          className={`text-xs px-4 py-1.5 rounded-full transition-colors ${
            snapToGrid 
              ? 'bg-pharmacy-primary/10 text-pharmacy-primary' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          onClick={toggleSnapToGrid}
        >
          Aimanter {snapToGrid ? 'On' : 'Off'}
        </button>
        
        {/* Ajouter le dialogue de redimensionnement du canvas ici */}
        <CanvasSizeDialog 
          className="text-xs px-4 py-1.5 rounded-full transition-colors bg-gray-100 hover:bg-gray-200 text-gray-700"
        />
      </div>
      
      {/* Information sur les éléments */}
      <div className="flex items-center space-x-4">
        
        
        {selectedCount > 0 && (
          <div className="flex space-x-2">
            <button
              className="text-xs px-3 py-1.5 rounded-full bg-pharmacy-primary/90 hover:bg-pharmacy-primary text-white transition-colors shadow-sm"
              onClick={onCopy}
              title={`Copier (${ctrlKey}+C)`}
            >
              Copier
            </button>
            <button
              className="text-xs px-3 py-1.5 rounded-full bg-pharmacy-warning/90 hover:bg-pharmacy-warning text-white transition-colors shadow-sm"
              onClick={onCut}
              title={`Couper (${ctrlKey}+X)`}
            >
              Couper
            </button>
            <button
              className="text-xs px-3 py-1.5 rounded-full bg-pharmacy-danger/90 hover:bg-pharmacy-danger text-white transition-colors shadow-sm"
              onClick={onDeleteSelected}
              title="Supprimer (Delete)"
            >
              Supprimer
            </button>
            <button
              className="text-xs px-3 py-1.5 rounded-full bg-gray-200/90 hover:bg-gray-200 text-gray-700 transition-colors"
              onClick={onDeselectAll}
            >
              Désélectionner
            </button>
          </div>
        )}
        
        <button
          className="text-xs px-3 py-1.5 rounded-full bg-pharmacy-success/90 hover:bg-pharmacy-success text-white transition-colors shadow-sm"
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