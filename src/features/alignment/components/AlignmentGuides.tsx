'use client';

import React from 'react';
import { AlignmentGuide } from '../types';

interface AlignmentGuidesProps {
  guides: AlignmentGuide[];
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  viewportOffset: { x: number; y: number };
}

/**
 * Composant pour dessiner les guides d'alignement
 */
const AlignmentGuides: React.FC<AlignmentGuidesProps> = ({
  guides,
  canvasWidth,
  canvasHeight,
  zoom,
  viewportOffset
}) => {
  if (guides.length === 0) return null;
  
  return (
    <svg
      className="absolute top-0 left-0 pointer-events-none"
      width={canvasWidth}
      height={canvasHeight}
      style={{ zIndex: 1000 }}
    >
      {guides.map(guide => {
        if (guide.type === 'horizontal') {
          // Guide horizontal (ligne horizontale)
          return (
            <line
              key={guide.id}
              x1={guide.start * zoom + viewportOffset.x}
              y1={guide.position * zoom + viewportOffset.y}
              x2={guide.end * zoom + viewportOffset.x}
              y2={guide.position * zoom + viewportOffset.y}
              stroke="#0084ff"
              strokeWidth={1}
              strokeDasharray="4 2"
            />
          );
        } else {
          // Guide vertical (ligne verticale)
          return (
            <line
              key={guide.id}
              x1={guide.position * zoom + viewportOffset.x}
              y1={guide.start * zoom + viewportOffset.y}
              x2={guide.position * zoom + viewportOffset.x}
              y2={guide.end * zoom + viewportOffset.y}
              stroke="#ff0084"
              strokeWidth={1}
              strokeDasharray="4 2"
            />
          );
        }
      })}
    </svg>
  );
};

export default AlignmentGuides;