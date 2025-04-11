'use client';

import React from 'react';
import { RectanglePropertiesPanelProps } from '../types';
import EditableField from '@/components/ui/EditableField';
import PropertyGroup from '@/components/ui/PropertyGroup';
import ColorDisplay from '@/components/ui/ColorDisplay';

/**
 * Panneau pour éditer les propriétés d'un rectangle
 */
const RectanglePropertiesPanel: React.FC<RectanglePropertiesPanelProps> = ({ 
  element, 
  updateElement 
}) => {
  const { id, bounds, transform, metadata, cornerRadius, backgroundColor, borderColor } = element;

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

  const handleCornerRadiusUpdate = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    updateElement(id, {
      cornerRadius: Math.max(0, numValue)
    });
  };

  // Normalize rotation to 0-360 degrees for display
  const normalizedRotation = ((transform.rotation % 360) + 360) % 360;
  const isRotated = normalizedRotation !== 0;

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6 tracking-tight">Propriétés du Rectangle</h2>
      
      <div className="space-y-8">
        <div className="bg-white rounded-lg border border-gray-100/80 shadow-sm p-5">
          <PropertyGroup title="Identification">
            <input 
              type="text" 
              value={metadata.name || ''} 
              readOnly
              className="w-full border border-gray-200/80 rounded-lg py-2 px-3 text-sm bg-gray-50/80"
            />
          </PropertyGroup>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-100/80 shadow-sm p-5">
          <PropertyGroup title="Position">
            <div className="flex gap-3">
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
        </div>
        
        <div className="bg-white rounded-lg border border-gray-100/80 shadow-sm p-5">
          <PropertyGroup title="Dimensions">
            <div className="flex gap-3">
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
                prefix="H: "
                className="w-1/2"
              />
            </div>
            {isRotated && (
              <div className="mt-3 text-xs text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-100">
                Remettez la rotation à 0° pour redimensionner avec les poignées
              </div>
            )}
          </PropertyGroup>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-100/80 shadow-sm p-5">
          <PropertyGroup title="Rotation">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <EditableField 
                  label="" 
                  value={Math.round(normalizedRotation)} 
                  onUpdate={handleRotationUpdate} 
                  suffix="°"
                  className="flex-1"
                />
                <button 
                  className="px-3 py-2 text-xs bg-pharmacy-primary/10 text-pharmacy-primary hover:bg-pharmacy-primary/20 rounded-md transition-colors"
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
                  className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer"
                />
              </div>
            </div>
          </PropertyGroup>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-100/80 shadow-sm p-5">
          <PropertyGroup title="Apparence">
            <EditableField 
              label="Rayon des coins" 
              value={cornerRadius || 0} 
              onUpdate={handleCornerRadiusUpdate} 
            />
            
            <div className="mt-4">
              <ColorDisplay label="Couleur de fond" color={backgroundColor} />
            </div>
            
            {borderColor && (
              <div className="mt-4">
                <ColorDisplay label="Couleur de bordure" color={borderColor} />
              </div>
            )}
          </PropertyGroup>
        </div>
      </div>
    </div>
  );
};

export default RectanglePropertiesPanel;