import { PropertyGroupProps } from '@/features/properties';
import React from 'react';

/**
 * Composant pour grouper des propriétés avec un titre
 */
const PropertyGroup: React.FC<PropertyGroupProps> = ({ 
  title, 
  children, 
  className = '' 
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="text-xs font-medium text-gray-700">{title}</label>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
};

export default PropertyGroup;