'use client';

import React from 'react';
import EditableField from '@/components/ui/EditableField';
import PropertyGroup from '@/components/ui/PropertyGroup';
import ColorDisplay from '@/components/ui/ColorDisplay';
import { EndCapElement } from '@/types/elements';

interface EndCapPropertiesPanelProps {
  element: EndCapElement;
  updateElement: (id: string, updates: Partial<EndCapElement>) => void;
}

/**
 * Panneau pour éditer les propriétés d'une tête de gondole
 */
const EndCapPropertiesPanel: React.FC<EndCapPropertiesPanelProps> = ({ 
  element, 
  updateElement 
}) => {
  const { id, bounds, transform, metadata, shelfCount, shelfHeight, shelfDepth, isPremium, backgroundColor, borderColor, highlightColor } = element;

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

  const handleShelfCountUpdate = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
    updateElement(id, {
      shelfCount: Math.max(0, numValue)
    });
  };

  const handleShelfHeightUpdate = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    updateElement(id, {
      shelfHeight: Math.max(10, numValue)
    });
  };

  const handleShelfDepthUpdate = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    updateElement(id, {
      shelfDepth: Math.max(10, numValue)
    });
  };

  const handleIsPremiumToggle = () => {
    updateElement(id, {
      isPremium: !isPremium
    });
  };

  // Normalize rotation to 0-360 degrees for display
  const normalizedRotation = ((transform.rotation % 360) + 360) % 360;
  const isRotated = normalizedRotation !== 0;

  return (
    <div className="p-4">
      <h2 className="font-semibold mb-4 text-pharmacy-primary">Propriétés de la Tête de Gondole</h2>
      
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
              label="Nombre d'étagères" 
              value={shelfCount} 
              onUpdate={handleShelfCountUpdate} 
            />
            
            <EditableField 
              label="Hauteur étagère (cm)" 
              value={shelfHeight} 
              onUpdate={handleShelfHeightUpdate} 
            />
            
            <EditableField 
              label="Profondeur étagère (cm)" 
              value={shelfDepth} 
              onUpdate={handleShelfDepthUpdate} 
            />
            
            <div className="flex items-center gap-2 mt-2">
              <input 
                type="checkbox" 
                id="isPremium" 
                checked={isPremium} 
                onChange={handleIsPremiumToggle}
                className="h-4 w-4 text-pharmacy-primary rounded border-gray-300 focus:ring-pharmacy-primary"
              />
              <label htmlFor="isPremium" className="text-sm">
                Emplacement premium
              </label>
            </div>
          </div>
        </PropertyGroup>
        
        <ColorDisplay label="Couleur de fond" color={backgroundColor} />
        
        {borderColor && (
          <ColorDisplay label="Couleur de bordure" color={borderColor} />
        )}
        
        {isPremium && highlightColor && (
          <ColorDisplay label="Couleur de mise en valeur" color={highlightColor} />
        )}
      </div>
    </div>
  );
};

export default EndCapPropertiesPanel;