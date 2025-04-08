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

  const handleCornerRadiusUpdate = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    updateElement(id, {
      cornerRadius: Math.max(0, numValue)
    });
  };

  return (
    <div className="p-4">
      <h2 className="font-semibold mb-4 text-pharmacy-primary">Propriétés du Rectangle</h2>
      
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
              prefix="H: "
              className="w-1/2"
            />
          </div>
        </PropertyGroup>
        
        <EditableField 
          label="Rotation" 
          value={Math.round(transform.rotation)} 
          onUpdate={handleRotationUpdate} 
          suffix="°"
        />
        
        <EditableField 
          label="Rayon des coins" 
          value={cornerRadius || 0} 
          onUpdate={handleCornerRadiusUpdate} 
        />
        
        <ColorDisplay label="Couleur de fond" color={backgroundColor} />
        
        {borderColor && (
          <ColorDisplay label="Couleur de bordure" color={borderColor} />
        )}
      </div>
    </div>
  );
};

export default RectanglePropertiesPanel;