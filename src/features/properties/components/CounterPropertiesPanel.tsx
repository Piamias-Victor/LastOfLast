'use client';

import React from 'react';
import EditableField from '@/components/ui/EditableField';
import PropertyGroup from '@/components/ui/PropertyGroup';
import ColorDisplay from '@/components/ui/ColorDisplay';
import { CounterElement } from '@/types/elements';

interface CounterPropertiesPanelProps {
  element: CounterElement;
  updateElement: (id: string, updates: Partial<CounterElement>) => void;
}

/**
 * Panneau pour éditer les propriétés d'un comptoir
 */
const CounterPropertiesPanel: React.FC<CounterPropertiesPanelProps> = ({ 
  element, 
  updateElement 
}) => {
  const { id, bounds, transform, metadata, counterHeight, stations, hasStorage, isAccessible, backgroundColor, borderColor } = element;

  // Handlers pour mettre à jour les propriétés
  const handlePositionXUpdate = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    updateElement(id, {
      bounds: { ...bounds, x: numValue },
      transform: { ...transform, position: { ...transform.position, x: numValue } }
    });
  };

  const handlePositionYUpdate = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    updateElement(id, {
      bounds: { ...bounds, y: numValue },
      transform: { ...transform, position: { ...transform.position, y: numValue } }
    });
  };

  const handleWidthUpdate = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    updateElement(id, {
      bounds: { ...bounds, width: Math.max(10, numValue) }
    });
  };

  const handleHeightUpdate = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    updateElement(id, {
      bounds: { ...bounds, height: Math.max(10, numValue) }
    });
  };

  const handleRotationUpdate = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    updateElement(id, {
      transform: { ...transform, rotation: numValue }
    });
  };

  const handleRotationSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    updateElement(id, {
      transform: { ...transform, rotation: value }
    });
  };

  const handleResetRotation = () => {
    updateElement(id, {
      transform: { ...transform, rotation: 0 }
    });
  };

  const handleCounterHeightUpdate = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    updateElement(id, {
      counterHeight: Math.max(50, numValue)
    });
  };

  const handleStationsUpdate = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
    updateElement(id, {
      stations: Math.max(1, numValue)
    });
  };

  const handleHasStorageToggle = () => {
    updateElement(id, {
      hasStorage: !hasStorage
    });
  };

  const handleIsAccessibleToggle = () => {
    updateElement(id, {
      isAccessible: !isAccessible
    });
  };

  // Normalize rotation to 0-360 degrees for display
  const normalizedRotation = ((transform.rotation % 360) + 360) % 360;
  const isRotated = normalizedRotation !== 0;

  return (
    <div className="p-4">
      <h2 className="font-semibold mb-4 text-pharmacy-primary">Propriétés du Comptoir</h2>
      
      <div className="space-y-3">
        <PropertyGroup title="Nom">
          <input 
            type="text" 
            value={metadata.name || ''} 
            readOnly
            className="w-full border rounded-md py-1 px-2 text-sm bg-gray-50"
          />
        </PropertyGroup>
        
        <PropertyGroup title="Position">
          <div className="flex gap-2">
            <EditableField 
              label="" 
              value={Math.round(bounds.x)} 
              onUpdate={handlePositionXUpdate} 
              prefix="X: "
              className="w-1/2"
            />
            <EditableField 
              label="" 
              value={Math.round(bounds.y)} 
              onUpdate={handlePositionYUpdate} 
              prefix="Y: "
              className="w-1/2"
            />
          </div>
        </PropertyGroup>
        
        <PropertyGroup title="Dimensions">
          <div className="flex gap-2">
            <EditableField 
              label="" 
              value={Math.round(bounds.width)} 
              onUpdate={handleWidthUpdate} 
              prefix="L: "
              className="w-1/2"
            />
            <EditableField 
              label="" 
              value={Math.round(bounds.height)} 
              onUpdate={handleHeightUpdate} 
              prefix="P: "
              className="w-1/2"
            />
          </div>
          {isRotated && (
            <div className="mt-1 text-xs text-amber-600">
              Remettez la rotation à 0° pour redimensionner avec les poignées
            </div>
          )}
        </PropertyGroup>
        
        <PropertyGroup title="Rotation">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <EditableField 
                label="" 
                value={Math.round(normalizedRotation)} 
                onUpdate={handleRotationUpdate} 
                suffix="°"
                className="flex-1"
              />
              <button 
                className="px-3 py-1 text-xs bg-pharmacy-primary text-white rounded hover:bg-pharmacy-accent transition-colors"
                onClick={handleResetRotation}
              >
                Réinitialiser
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="range" 
                min="0" 
                max="359" 
                value={Math.round(normalizedRotation)} 
                onChange={handleRotationSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </PropertyGroup>
        
        <PropertyGroup title="Spécifications">
          <div className="space-y-2">
            <EditableField 
              label="Hauteur du comptoir (cm)" 
              value={counterHeight} 
              onUpdate={handleCounterHeightUpdate} 
            />
            
            <EditableField 
              label="Nombre de postes" 
              value={stations} 
              onUpdate={handleStationsUpdate} 
            />
            
            <div className="flex items-center gap-2 mt-2">
              <input 
                type="checkbox" 
                id="hasStorage" 
                checked={hasStorage} 
                onChange={handleHasStorageToggle}
                className="h-4 w-4 text-pharmacy-primary rounded border-gray-300 focus:ring-pharmacy-primary"
              />
              <label htmlFor="hasStorage" className="text-sm">
                Stockage intégré
              </label>
            </div>
            
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="isAccessible" 
                checked={isAccessible} 
                onChange={handleIsAccessibleToggle}
                className="h-4 w-4 text-pharmacy-primary rounded border-gray-300 focus:ring-pharmacy-primary"
              />
              <label htmlFor="isAccessible" className="text-sm">
                Accessible PMR
              </label>
            </div>
          </div>
        </PropertyGroup>
        
        <ColorDisplay label="Couleur de fond" color={backgroundColor} />
        
        {borderColor && (
          <ColorDisplay label="Couleur de bordure" color={borderColor} />
        )}
      </div>
    </div>
  );
};

export default CounterPropertiesPanel;