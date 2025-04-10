// src/features/properties/components/WallPropertiesPanel.tsx (correction)
'use client';

import React from 'react';
import EditableField from '@/components/ui/EditableField';
import PropertyGroup from '@/components/ui/PropertyGroup';
import ColorDisplay from '@/components/ui/ColorDisplay';
import { WallElement } from '@/types/elements';
import { calculateWallBounds } from '@/features/drawing/utils/wallDrawing';

interface WallPropertiesPanelProps {
  element: WallElement;
  updateElement: (id: string, updates: Partial<WallElement>) => void;
}

/**
 * Panneau pour éditer les propriétés d'un mur
 */
const WallPropertiesPanel: React.FC<WallPropertiesPanelProps> = ({ 
  element, 
  updateElement 
}) => {
  const { id, startPoint, endPoint, thickness, color, isStructural, metadata } = element;

  // Calculer les longueurs
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  // Calculer l'angle en degrés
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const normalizedAngle = ((angle % 360) + 360) % 360;

  // Handlers pour mettre à jour les propriétés
  const handleStartPointXUpdate = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    const newStartPoint = { ...startPoint, x: numValue };
    
    // Recalculer les bounds
    const newBounds = calculateWallBounds(newStartPoint, endPoint, thickness);
    
    updateElement(id, {
      startPoint: newStartPoint,
      bounds: newBounds,
      transform: {
        ...element.transform,
        position: { x: newBounds.x, y: newBounds.y }
      }
    });
  };

  const handleStartPointYUpdate = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    const newStartPoint = { ...startPoint, y: numValue };
    
    // Recalculer les bounds
    const newBounds = calculateWallBounds(newStartPoint, endPoint, thickness);
    
    updateElement(id, {
      startPoint: newStartPoint,
      bounds: newBounds,
      transform: {
        ...element.transform,
        position: { x: newBounds.x, y: newBounds.y }
      }
    });
  };

  const handleEndPointXUpdate = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    const newEndPoint = { ...endPoint, x: numValue };
    
    // Recalculer les bounds
    const newBounds = calculateWallBounds(startPoint, newEndPoint, thickness);
    
    updateElement(id, {
      endPoint: newEndPoint,
      bounds: newBounds,
      transform: {
        ...element.transform,
        position: { x: newBounds.x, y: newBounds.y }
      }
    });
  };

  const handleEndPointYUpdate = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    const newEndPoint = { ...endPoint, y: numValue };
    
    // Recalculer les bounds
    const newBounds = calculateWallBounds(startPoint, newEndPoint, thickness);
    
    updateElement(id, {
      endPoint: newEndPoint,
      bounds: newBounds,
      transform: {
        ...element.transform,
        position: { x: newBounds.x, y: newBounds.y }
      }
    });
  };

  const handleThicknessUpdate = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // Assurer une épaisseur minimum
    const newThickness = Math.max(2, numValue);
    
    // Recalculer les bounds
    const newBounds = calculateWallBounds(startPoint, endPoint, newThickness);
    
    updateElement(id, {
      thickness: newThickness,
      bounds: newBounds,
      transform: {
        ...element.transform,
        position: { x: newBounds.x, y: newBounds.y }
      }
    });
  };

  const handleIsStructuralToggle = () => {
    updateElement(id, {
      isStructural: !isStructural
    });
  };

  // Nouveau handler pour la mise à jour de la longueur
  const handleLengthUpdate = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // Assurer une longueur minimum
    const newLength = Math.max(10, numValue);
    
    // Calculer le ratio de changement
    const ratio = newLength / length;
    
    // Garder le point de départ fixe et ajuster le point d'arrivée
    const newEndPoint = {
      x: startPoint.x + dx * ratio,
      y: startPoint.y + dy * ratio
    };
    
    // Recalculer les bounds
    const newBounds = calculateWallBounds(startPoint, newEndPoint, thickness);
    
    updateElement(id, {
      endPoint: newEndPoint,
      bounds: newBounds,
      transform: {
        ...element.transform,
        position: { x: newBounds.x, y: newBounds.y }
      }
    });
  };

  return (
    <div className="p-4">
      <h2 className="font-semibold mb-4 text-pharmacy-primary">Propriétés du Mur</h2>
      
      <div className="space-y-3">
        <PropertyGroup title="Nom">
          <input 
            type="text" 
            value={metadata.name || ''} 
            readOnly
            className="w-full border rounded-md py-1 px-2 text-sm bg-gray-50"
          />
        </PropertyGroup>
        
        <PropertyGroup title="Dimensions">
          <div className="flex gap-2">
            <EditableField 
              label="Longueur" 
              value={Math.round(length)} 
              suffix=" cm"
              onUpdate={handleLengthUpdate} // Modifier ici pour utiliser le handler
              className="w-1/2"
            />
            <EditableField 
              label="Épaisseur" 
              value={thickness} 
              suffix=" cm"
              onUpdate={handleThicknessUpdate} 
              className="w-1/2"
            />
          </div>
          <div className="mt-2">
            <EditableField 
              label="Angle" 
              value={Math.round(normalizedAngle)} 
              suffix="°"
              onUpdate={() => {}} // Lecture seule
            />
          </div>
        </PropertyGroup>
        
        <PropertyGroup title="Point de départ">
          <div className="flex gap-2">
            <EditableField 
              label="" 
              value={Math.round(startPoint.x)} 
              onUpdate={handleStartPointXUpdate} 
              prefix="X: "
              className="w-1/2"
            />
            <EditableField 
              label="" 
              value={Math.round(startPoint.y)} 
              onUpdate={handleStartPointYUpdate} 
              prefix="Y: "
              className="w-1/2"
            />
          </div>
        </PropertyGroup>
        
        <PropertyGroup title="Point d'arrivée">
          <div className="flex gap-2">
            <EditableField 
              label="" 
              value={Math.round(endPoint.x)} 
              onUpdate={handleEndPointXUpdate} 
              prefix="X: "
              className="w-1/2"
            />
            <EditableField 
              label="" 
              value={Math.round(endPoint.y)} 
              onUpdate={handleEndPointYUpdate} 
              prefix="Y: "
              className="w-1/2"
            />
          </div>
        </PropertyGroup>
        
        <div className="flex items-center gap-2 mt-4">
          <input 
            type="checkbox" 
            id="isStructural" 
            checked={isStructural} 
            onChange={handleIsStructuralToggle}
            className="h-4 w-4 text-pharmacy-primary rounded border-gray-300 focus:ring-pharmacy-primary"
          />
          <label htmlFor="isStructural" className="text-sm">
            Mur porteur
          </label>
        </div>
        
        <ColorDisplay label="Couleur" color={color} />
      </div>
    </div>
  );
};

export default WallPropertiesPanel;