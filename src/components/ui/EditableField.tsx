'use client';

import React from 'react';
import { EditableFieldProps } from '@/features/properties/types';
import { usePropertyEdit } from '@/features/properties/hooks/usePropertyEdit';

/**
 * Composant pour un champ éditable
 */
const EditableField: React.FC<EditableFieldProps> = ({ 
  label, 
  value, 
  onUpdate, 
  prefix = '', 
  suffix = '',
  className = '' 
}) => {
  const {
    isEditing,
    editValue,
    startEditing,
    handleChange,
    handleBlur,
    handleKeyDown
  } = usePropertyEdit({
    initialValue: value,
    onUpdate
  });

  // Format la valeur d'affichage
  const displayValue = `${prefix}${value}${suffix}`;

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-xs font-medium text-gray-500 tracking-wide">{label}</label>
      {isEditing ? (
        <input 
          type="text" 
          value={editValue} 
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-pharmacy-primary/20 focus:border-pharmacy-primary/30 shadow-sm"
        />
      ) : (
        <div 
          onClick={startEditing}
          className="w-full border border-gray-200/80 rounded-lg py-2 px-3 text-sm bg-gray-50/80 cursor-pointer hover:bg-gray-100/80 transition-colors"
        >
          {displayValue}
        </div>
      )}
    </div>
  );
};

export default EditableField;