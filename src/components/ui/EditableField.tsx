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
    <div className={`space-y-1 ${className}`}>
      <label className="text-xs font-medium text-gray-700">{label}</label>
      {isEditing ? (
        <input 
          type="text" 
          value={editValue} 
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full border rounded-md py-1 px-2 text-sm"
        />
      ) : (
        <input 
          type="text" 
          value={displayValue} // Utiliser value au lieu de defaultValue
          onClick={startEditing}
          readOnly
          className="w-full border rounded-md py-1 px-2 text-sm bg-gray-50 cursor-pointer hover:bg-gray-100"
        />
      )}
    </div>
  );
};

export default EditableField;