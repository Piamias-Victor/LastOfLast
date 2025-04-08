'use client';

import React from 'react';
import { ColorDisplayProps } from '@/features/properties/types';

/**
 * Composant pour afficher une couleur avec son code
 */
const ColorDisplay: React.FC<ColorDisplayProps> = ({ 
  label, 
  color, 
  className = '' 
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="text-xs font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-2">
        <div 
          className="w-6 h-6 rounded-md border" 
          style={{ backgroundColor: color }}
        ></div>
        <input 
          type="text" 
          value={color} // Utiliser value au lieu de defaultValue
          readOnly
          className="w-full border rounded-md py-1 px-2 text-sm bg-gray-50"
        />
      </div>
    </div>
  );
};

export default ColorDisplay;