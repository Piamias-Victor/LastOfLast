import React, { useRef, useEffect } from 'react';
import { useEditorStore } from '@/store';

interface MiniMapProps {
  width: number;
  height: number;
}

/**
 * Composant de mini-carte pour la navigation
 */
const MiniMap: React.FC<MiniMapProps> = ({ width, height }) => {
  const { elements, canvasDimensions, viewportOffset, zoom, setViewportOffset } = useEditorStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Ratio entre la carte et le canvas réel
  const ratio = 0.1; // 10% de la taille réelle
  
  // Dimensions de la mini-carte
  const miniMapWidth = Math.round(canvasDimensions.width * ratio);
  const miniMapHeight = Math.round(canvasDimensions.height * ratio);
  
  // Taille de la fenêtre de visualisation
  const viewportWidth = Math.min(width / zoom, canvasDimensions.width);
  const viewportHeight = Math.min(height / zoom, canvasDimensions.height);
  
  // Position de la fenêtre de visualisation dans la mini-carte
  const viewX = Math.max(0, -viewportOffset.x / zoom * ratio);
  const viewY = Math.max(0, -viewportOffset.y / zoom * ratio);
  const viewW = Math.min(miniMapWidth, viewportWidth * ratio);
  const viewH = Math.min(miniMapHeight, viewportHeight * ratio);
  
  // Dessiner la mini-carte
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Effacer le canvas
    context.clearRect(0, 0, miniMapWidth, miniMapHeight);
    
    // Dessiner le fond du canvas
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, miniMapWidth, miniMapHeight);
    
    // Dessiner les éléments (simplifiés)
    context.fillStyle = 'rgba(10, 91, 145, 0.3)';
    elements.forEach(element => {
      context.fillRect(
        element.bounds.x * ratio,
        element.bounds.y * ratio,
        element.bounds.width * ratio,
        element.bounds.height * ratio
      );
    });
    
    // Dessiner la bordure
    context.strokeStyle = '#e0e0e0';
    context.lineWidth = 1;
    context.strokeRect(0, 0, miniMapWidth, miniMapHeight);
    
    // Dessiner la fenêtre de visualisation
    context.strokeStyle = '#0a5b91';
    context.lineWidth = 2;
    context.strokeRect(viewX, viewY, viewW, viewH);
    
  }, [elements, miniMapWidth, miniMapHeight, ratio, viewX, viewY, viewW, viewH]);
  
  // Gérer le clic sur la mini-carte
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Calculer la position du clic dans la mini-carte
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convertir en position dans le canvas réel
    const targetX = -(x / ratio - viewportWidth / 2) * zoom;
    const targetY = -(y / ratio - viewportHeight / 2) * zoom;
    
    // Mettre à jour la position du viewport
    setViewportOffset({
      x: targetX,
      y: targetY
    });
  };
  
  return (
    <div className="absolute bottom-16 right-4 bg-white p-1 border border-gray-200 rounded shadow-lg">
      <canvas
        ref={canvasRef}
        width={miniMapWidth}
        height={miniMapHeight}
        onClick={handleClick}
        className="cursor-pointer"
      />
    </div>
  );
};

export default MiniMap;