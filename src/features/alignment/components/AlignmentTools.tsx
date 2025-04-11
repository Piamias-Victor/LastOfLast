'use client';

import React from 'react';
import { HorizontalAlignment, VerticalAlignment } from '../types';

interface AlignmentToolsProps {
  onAlignHorizontally: (alignment: HorizontalAlignment) => void;
  onAlignVertically: (alignment: VerticalAlignment) => void;
  onDistributeHorizontally: () => void;
  onDistributeVertically: () => void;
  disabled: boolean;
}

/**
 * Barre d'outils pour l'alignement des éléments
 */
const AlignmentTools: React.FC<AlignmentToolsProps> = ({
  onAlignHorizontally,
  onAlignVertically,
  onDistributeHorizontally,
  onDistributeVertically,
  disabled
}) => {
  return (
    <div className="flex border-b border-gray-100/80 bg-gray-50/70 backdrop-blur-sm p-2">
      <div className="flex space-x-1.5 mr-6">
        <span className="text-xs text-gray-500 flex items-center mr-2">Alignement :</span>
        <button
          className="text-xs p-1.5 rounded-md bg-white hover:bg-gray-50 text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-100 shadow-sm"
          onClick={() => onAlignHorizontally(HorizontalAlignment.LEFT)}
          disabled={disabled}
          title="Aligner à gauche"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
            <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M4 2V22M8 7H20M8 17H20" />
          </svg>
        </button>
        <button
          className="text-xs p-1.5 rounded-md bg-white hover:bg-gray-50 text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-100 shadow-sm"
          onClick={() => onAlignHorizontally(HorizontalAlignment.CENTER)}
          disabled={disabled}
          title="Centrer horizontalement"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
            <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M12 2V22M6 7H18M6 17H18" />
          </svg>
        </button>
        <button
          className="text-xs p-1.5 rounded-md bg-white hover:bg-gray-50 text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-100 shadow-sm"
          onClick={() => onAlignHorizontally(HorizontalAlignment.RIGHT)}
          disabled={disabled}
          title="Aligner à droite"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
            <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M20 2V22M4 7H16M4 17H16" />
          </svg>
        </button>
        <button
          className="text-xs p-1.5 rounded-md bg-white hover:bg-gray-50 text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-100 shadow-sm"
          onClick={() => onAlignVertically(VerticalAlignment.TOP)}
          disabled={disabled}
          title="Aligner en haut"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
            <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M2 4H22M7 8V20M17 8V20" />
          </svg>
        </button>
        <button
          className="text-xs p-1.5 rounded-md bg-white hover:bg-gray-50 text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-100 shadow-sm"
          onClick={() => onAlignVertically(VerticalAlignment.MIDDLE)}
          disabled={disabled}
          title="Centrer verticalement"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
            <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M2 12H22M7 6V18M17 6V18" />
          </svg>
        </button>
        <button
          className="text-xs p-1.5 rounded-md bg-white hover:bg-gray-50 text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-100 shadow-sm"
          onClick={() => onAlignVertically(VerticalAlignment.BOTTOM)}
          disabled={disabled}
          title="Aligner en bas"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
            <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M2 20H22M7 4V16M17 4V16" />
          </svg>
        </button>
      </div>
      
      <div className="flex space-x-1.5">
        <span className="text-xs text-gray-500 flex items-center mr-2">Distribution :</span>
        <button
          className="text-xs p-1.5 rounded-md bg-white hover:bg-gray-50 text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-100 shadow-sm"
          onClick={onDistributeHorizontally}
          disabled={disabled}
          title="Distribuer horizontalement"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
            <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M4 2V22M20 2V22M9 12H15" />
          </svg>
        </button>
        <button
          className="text-xs p-1.5 rounded-md bg-white hover:bg-gray-50 text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-100 shadow-sm"
          onClick={onDistributeVertically}
          disabled={disabled}
          title="Distribuer verticalement"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
            <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M2 4H22M2 20H22M12 9V15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AlignmentTools;