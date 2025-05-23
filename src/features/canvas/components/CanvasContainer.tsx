// src/features/canvas/components/CanvasContainer.tsx (modification)
import React from 'react';
import { useEditorStore } from '@/store';
import CanvasTools from './CanvasTools';
import CanvasFooter from './CanvasFooter';
import { AlignmentTools } from '@/features/alignment';
import Toast from '@/components/ui/Toast';
import CanvasWorkspace from './workspace/CanvasWorkspace';
import { useCanvasSize } from '../hooks/setup/useCanvasSize';
import { useCanvasNotifications } from '../hooks/setup/useCanvasNotifications';
import { useCanvasSetupEffects } from '../hooks/setup/useCanvasSetupEffects';
import { useCanvasActionHandlers } from '../hooks/setup/useCanvasActionHandlers';
import DrawingModeIndicator from './DrawingModeIndicator';
import MiniMap from './navigation/MiniMap';

interface CanvasContainerProps {
  width?: number;
  height?: number;
}

/**
 * Composant conteneur principal pour le canvas et ses outils
 */
const CanvasContainer: React.FC<CanvasContainerProps> = ({ width, height }) => {
  // Hooks pour la gestion du canvas
  const { containerRef, containerSize } = useCanvasSize();
  const { toast, showToast, hideToast } = useCanvasNotifications();
  
  // Effectuer les dimensions du canvas depuis les props ou le store
  const actualWidth = width || containerSize.width;
  const actualHeight = height || containerSize.height;
  
  // Effets de configuration
  useCanvasSetupEffects({ showToast });
  
  // État global de l'éditeur
  const { 
    toggleGrid, 
    toggleSnapToGrid, 
    gridEnabled, 
    snapToGrid,
    elements,
    selectedElementIds,
    deselectAll
  } = useEditorStore();
  
  // Gestionnaires d'action
  const {
    handleCopy,
    handlePaste,
    handleCut,
    handleDelete,
    handleAlignHorizontally,
    handleAlignVertically,
    handleDistributeHorizontally,
    handleDistributeVertically
  } = useCanvasActionHandlers({ showToast });

  return (
    <div className="flex h-full w-full flex-col">
      {/* Barre d'outils principale */}
      <CanvasTools
        gridEnabled={gridEnabled}
        toggleGrid={toggleGrid}
        snapToGrid={snapToGrid}
        toggleSnapToGrid={toggleSnapToGrid}
        elementsCount={elements.length}
        selectedCount={selectedElementIds.length}
        onDeselectAll={deselectAll}
        onDeleteSelected={handleDelete}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onCut={handleCut}
      />
      
      {/* Barre d'outils d'alignement */}
      <AlignmentTools
        onAlignHorizontally={handleAlignHorizontally}
        onAlignVertically={handleAlignVertically}
        onDistributeHorizontally={handleDistributeHorizontally}
        onDistributeVertically={handleDistributeVertically}
        disabled={selectedElementIds.length <= 1}
      />
      
      {/* Conteneur du canvas */}
      <div ref={containerRef} className="flex-grow overflow-hidden bg-gray-50 relative">
        {/* Indicateur de mode dessin */}
        <DrawingModeIndicator />
        
        {actualWidth > 0 && actualHeight > 0 && (
          <CanvasWorkspace 
            width={actualWidth} 
            height={actualHeight} 
          />
        )}
      </div>
      
      {/* Notification toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={2000}
          onClose={hideToast}
        />
      )}

      {/* <MiniMap width={containerSize.width} height={containerSize.height} /> */}

      {/* Pied de page avec raccourcis */}
      <CanvasFooter />
    </div>
  );
};

export default CanvasContainer;