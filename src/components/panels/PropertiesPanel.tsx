'use client';

import React, { useState } from 'react';
import { useEditorStore } from '@/states/editorStore';
import { ElementType, RectangleElement } from '@/types/elements';

const PropertiesPanel: React.FC = () => {
  const { elements, selectedElementIds, updateElement } = useEditorStore();
  
  // État local pour l'édition
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  
  // Fonction pour commencer l'édition d'un champ
  const startEditing = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };
  
  // Fonction pour terminer l'édition et appliquer les changements
  const finishEditing = (id: string, field: string) => {
    if (!editingField) return;
    
    const element = elements.find(el => el.id === id);
    if (!element) return;
    
    // Convertir la valeur en nombre si nécessaire
    const numValue = parseFloat(editValue);
    
    if (isNaN(numValue)) {
      // Réinitialiser l'édition sans appliquer les changements
      setEditingField(null);
      return;
    }
    
    // Appliquer les changements selon le champ
    switch (field) {
      case 'x':
        updateElement(id, {
          bounds: { ...element.bounds, x: numValue },
          transform: { ...element.transform, position: { ...element.transform.position, x: numValue } }
        });
        break;
      case 'y':
        updateElement(id, {
          bounds: { ...element.bounds, y: numValue },
          transform: { ...element.transform, position: { ...element.transform.position, y: numValue } }
        });
        break;
      case 'width':
        updateElement(id, {
          bounds: { ...element.bounds, width: Math.max(10, numValue) }
        });
        break;
      case 'height':
        updateElement(id, {
          bounds: { ...element.bounds, height: Math.max(10, numValue) }
        });
        break;
      case 'rotation':
        updateElement(id, {
          transform: { ...element.transform, rotation: numValue }
        });
        break;
      case 'cornerRadius':
        if (element.type === ElementType.RECTANGLE) {
          // Cast pour informer TypeScript que c'est un rectangle
          const rectangleElement = element as RectangleElement;
          updateElement(id, {
            // Spread pour conserver tous les attributs existants
            ...rectangleElement,
            cornerRadius: Math.max(0, numValue)
          });
        }
        break;
    }
    
    // Réinitialiser l'état d'édition
    setEditingField(null);
  };
  
  // Pas d'élément sélectionné
  if (selectedElementIds.length === 0) {
    return (
      <div className="p-4">
        <h2 className="font-semibold mb-4 text-pharmacy-primary">Propriétés</h2>
        <p className="text-sm text-gray-500">
          Sélectionnez un élément pour voir ses propriétés.
        </p>
      </div>
    );
  }
  
  // Sélection multiple
  if (selectedElementIds.length > 1) {
    const selectedElements = elements.filter(el => selectedElementIds.includes(el.id));
    
    return (
      <div className="p-4">
        <h2 className="font-semibold mb-2 text-pharmacy-primary">Sélection Multiple</h2>
        <p className="text-sm mb-4 text-gray-600">
          {selectedElementIds.length} éléments sélectionnés
        </p>
        
        {/* Information sur les types d'éléments */}
        <div className="mb-4">
          <h3 className="text-xs font-medium text-gray-700 mb-2">Types d&apos;éléments</h3>
          <div className="space-y-2">
            {Array.from(new Set(selectedElements.map(el => el.type))).map(type => (
              <div key={type} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pharmacy-secondary"></div>
                <span className="text-sm">
                  {type === ElementType.RECTANGLE ? 'Rectangle' : type}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t pt-4 mt-4">
          <p className="text-xs text-gray-500">
            Sélectionnez un seul élément pour modifier ses propriétés spécifiques.
          </p>
        </div>
      </div>
    );
  }
  
  // Un seul élément sélectionné
  const selectedElement = elements.find(el => el.id === selectedElementIds[0]);
  
  if (!selectedElement) {
    return (
      <div className="p-4">
        <h2 className="font-semibold mb-4 text-pharmacy-primary">Propriétés</h2>
        <p className="text-sm text-gray-500">
          L&apos;élément sélectionné n&apos;existe plus.
        </p>
      </div>
    );
  }
  
  // Propriétés communes à tous les éléments
  const { id, metadata, bounds, transform } = selectedElement;

  // Interface différente selon le type d'élément
  if (selectedElement.type === ElementType.RECTANGLE) {
    const rectangle = selectedElement as RectangleElement;
    return (
      <div className="p-4">
        <h2 className="font-semibold mb-4 text-pharmacy-primary">Propriétés du Rectangle</h2>
        
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Nom</label>
            <input 
              type="text" 
              defaultValue={metadata.name} 
              readOnly
              className="w-full border rounded-md py-1 px-2 text-sm bg-gray-50"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Position</label>
            <div className="flex gap-2">
              {editingField === 'x' ? (
                <input 
                  type="text" 
                  value={editValue} 
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => finishEditing(id, 'x')}
                  onKeyDown={(e) => e.key === 'Enter' && finishEditing(id, 'x')}
                  autoFocus
                  className="w-full border rounded-md py-1 px-2 text-sm"
                />
              ) : (
                <input 
                  type="text" 
                  defaultValue={`X: ${Math.round(bounds.x)}`} 
                  onClick={() => startEditing('x', bounds.x.toString())}
                  readOnly
                  className="w-full border rounded-md py-1 px-2 text-sm bg-gray-50 cursor-pointer hover:bg-gray-100"
                />
              )}
              
              {editingField === 'y' ? (
                <input 
                  type="text" 
                  value={editValue} 
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => finishEditing(id, 'y')}
                  onKeyDown={(e) => e.key === 'Enter' && finishEditing(id, 'y')}
                  autoFocus
                  className="w-full border rounded-md py-1 px-2 text-sm"
                />
              ) : (
                <input 
                  type="text" 
                  defaultValue={`Y: ${Math.round(bounds.y)}`} 
                  onClick={() => startEditing('y', bounds.y.toString())}
                  readOnly
                  className="w-full border rounded-md py-1 px-2 text-sm bg-gray-50 cursor-pointer hover:bg-gray-100"
                />
              )}
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Dimensions</label>
            <div className="flex gap-2">
              {editingField === 'width' ? (
                <input 
                  type="text" 
                  value={editValue} 
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => finishEditing(id, 'width')}
                  onKeyDown={(e) => e.key === 'Enter' && finishEditing(id, 'width')}
                  autoFocus
                  className="w-full border rounded-md py-1 px-2 text-sm"
                />
              ) : (
                <input 
                  type="text" 
                  defaultValue={`L: ${Math.round(bounds.width)}`} 
                  onClick={() => startEditing('width', bounds.width.toString())}
                  readOnly
                  className="w-full border rounded-md py-1 px-2 text-sm bg-gray-50 cursor-pointer hover:bg-gray-100"
                />
              )}
              
              {editingField === 'height' ? (
                <input 
                  type="text" 
                  value={editValue} 
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => finishEditing(id, 'height')}
                  onKeyDown={(e) => e.key === 'Enter' && finishEditing(id, 'height')}
                  autoFocus
                  className="w-full border rounded-md py-1 px-2 text-sm"
                />
              ) : (
                <input 
                  type="text" 
                  defaultValue={`H: ${Math.round(bounds.height)}`} 
                  onClick={() => startEditing('height', bounds.height.toString())}
                  readOnly
                  className="w-full border rounded-md py-1 px-2 text-sm bg-gray-50 cursor-pointer hover:bg-gray-100"
                />
              )}
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Rotation</label>
            {editingField === 'rotation' ? (
              <input 
                type="text" 
                value={editValue} 
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => finishEditing(id, 'rotation')}
                onKeyDown={(e) => e.key === 'Enter' && finishEditing(id, 'rotation')}
                autoFocus
                className="w-full border rounded-md py-1 px-2 text-sm"
              />
            ) : (
              <input 
                type="text" 
                defaultValue={`${Math.round(transform.rotation)}°`} 
                onClick={() => startEditing('rotation', transform.rotation.toString())}
                readOnly
                className="w-full border rounded-md py-1 px-2 text-sm bg-gray-50 cursor-pointer hover:bg-gray-100"
              />
            )}
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Rayon des coins</label>
            {editingField === 'cornerRadius' ? (
              <input 
                type="text" 
                value={editValue} 
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => finishEditing(id, 'cornerRadius')}
                onKeyDown={(e) => e.key === 'Enter' && finishEditing(id, 'cornerRadius')}
                autoFocus
                className="w-full border rounded-md py-1 px-2 text-sm"
              />
            ) : (
              <input 
                type="text" 
                defaultValue={rectangle.cornerRadius || 0} 
                onClick={() => startEditing('cornerRadius', (rectangle.cornerRadius || 0).toString())}
                readOnly
                className="w-full border rounded-md py-1 px-2 text-sm bg-gray-50 cursor-pointer hover:bg-gray-100"
              />
            )}
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Couleur de fond</label>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded-md border" 
                style={{ backgroundColor: rectangle.backgroundColor }}
              ></div>
              <input 
                type="text" 
                defaultValue={rectangle.backgroundColor} 
                readOnly
                className="w-full border rounded-md py-1 px-2 text-sm bg-gray-50"
              />
            </div>
          </div>
          
          {rectangle.borderColor && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Couleur de bordure</label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-md border" 
                  style={{ backgroundColor: rectangle.borderColor }}
                ></div>
                <input 
                  type="text" 
                  defaultValue={rectangle.borderColor} 
                  readOnly
                  className="w-full border rounded-md py-1 px-2 text-sm bg-gray-50"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <h2 className="font-semibold mb-4 text-pharmacy-primary">Propriétés</h2>
      <p className="text-sm text-gray-500">
        Type d&apos;élément non géré : {selectedElement.type}
      </p>
    </div>
  );
};

export default PropertiesPanel;