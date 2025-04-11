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
    <div className={`space-y-2 ${className}`}>
      <label className="text-xs font-medium text-gray-500 tracking-wide">{label}</label>
      <div className="flex items-center gap-3">
        <div 
          className="w-8 h-8 rounded-md border border-gray-100 shadow-sm overflow-hidden" 
          style={{ backgroundColor: color }}
        ></div>
        <input 
          type="text" 
          value={color} 
          readOnly
          className="flex-1 border border-gray-200/80 rounded-lg py-2 px-3 text-sm bg-gray-50/80 font-mono text-gray-600"
        />
      </div>
    </div>
  );
};

export default ColorDisplay;