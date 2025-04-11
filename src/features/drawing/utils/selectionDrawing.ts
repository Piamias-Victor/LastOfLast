'use client';

import { Bounds, Vector2D } from '@/types/geometry';
import { EDITOR_COLORS } from '@/lib/constants/editor';
import { SelectionIndicatorOptions } from '../types';
import { 
  calculateRotationHandlePosition, 
  ROTATION_HANDLE_SIZE,
  rotatePoint
} from '@/lib/utils/rotationUtils';
import { AnyPlanElement } from '@/types/elements';
import { createDrawingContext } from './drawingContext';

/**
 * Dessine un indicateur de sélection autour d'une zone
 */
export function drawSelectionIndicator(
  context: CanvasRenderingContext2D,
  bounds: Bounds,
  options: SelectionIndicatorOptions = {}
): void {
  drawSelectionForElement(context, {
    id: '',
    type: 'rectangle', 
    bounds, 
    transform: { position: { x: bounds.x, y: bounds.y }, rotation: 0, scale: { x: 1, y: 1 } },
    zIndex: 0,
    isLocked: false,
    isVisible: true,
    isSelected: true,
    metadata: { name: '', customProperties: {} }
  }, options);
}

/**
 * Dessine un indicateur de sélection pour un élément spécifique, en tenant compte de sa rotation
 */
export function drawSelectionForElement(
  context: CanvasRenderingContext2D,
  element: AnyPlanElement,
  options: SelectionIndicatorOptions = {}
): void {
  const { 
    padding = 5, 
    handleSize = 12, 
    lineWidth = 2,
    lineDash = [5, 3]
  } = options;
  
  const { bounds, transform } = element;
  const { x, y, width, height } = bounds;
  const rotation = transform.rotation;
  
  // Calculer le centre de l'élément
  const center = { x: x + width / 2, y: y + height / 2 };
  
  // Créer un contexte de dessin pour appliquer les transformations
  const drawContext = createDrawingContext(context);
  
  // Sauvegarder l'état du contexte
  drawContext.save();
  
  // Appliquer la rotation si l'élément est pivoté
  if (rotation !== 0) {
    drawContext.transform(element);
  }
  
  // Dessiner le cadre de sélection
  context.strokeStyle = EDITOR_COLORS.selection;
  context.lineWidth = lineWidth;
  context.setLineDash(lineDash);
  
  // Dessiner un cadre arrondi pour la sélection
  const selectionRadius = 4;
  const padX = x - padding;
  const padY = y - padding;
  const padWidth = width + padding * 2;
  const padHeight = height + padding * 2;
  
  context.beginPath();
  context.moveTo(padX + selectionRadius, padY);
  context.arcTo(padX + padWidth, padY, padX + padWidth, padY + padHeight, selectionRadius);
  context.arcTo(padX + padWidth, padY + padHeight, padX, padY + padHeight, selectionRadius);
  context.arcTo(padX, padY + padHeight, padX, padY, selectionRadius);
  context.arcTo(padX, padY, padX + padWidth, padY, selectionRadius);
  context.closePath();
  context.stroke();
  
  // Dessiner les poignées de redimensionnement seulement si l'élément n'est pas pivoté
  if (rotation === 0) {
    drawResizeHandles(context, bounds, handleSize);
  } else {
    // Si l'élément est pivoté, afficher un message de rotation
    context.fillStyle = 'rgba(10, 91, 145, 0.9)';
    context.fillRect(x + width / 2 - 100, y + height / 2 - 15, 200, 30);
    context.font = '12px sans-serif';
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('(Remettez à 0° pour redimensionner)', x + width / 2, y + height / 2);
  }
  
  // Restaurer l'état du contexte avant de dessiner la poignée de rotation
  drawContext.restore();
  
  // Dessiner la poignée de rotation en tenant compte de la rotation
  drawRotationHandle(context, element);
}

/**
 * Dessine les poignées de redimensionnement
 */
export function drawResizeHandles(
  context: CanvasRenderingContext2D,
  bounds: Bounds,
  handleSize: number = 12
): void {
  const { x, y, width, height } = bounds;
  const halfHandle = handleSize / 2;
  
  // Réinitialiser le style de ligne
  context.setLineDash([]);
  context.fillStyle = EDITOR_COLORS.resizeHandleFill;
  context.strokeStyle = EDITOR_COLORS.resizeHandle;
  context.lineWidth = 2;
  
  // Positions des poignées (8 poignées)
  const handles = [
    { x: x - halfHandle, y: y - halfHandle }, // Top-Left
    { x: x + width / 2 - halfHandle, y: y - halfHandle }, // Top-Center
    { x: x + width - halfHandle, y: y - halfHandle }, // Top-Right
    { x: x + width - halfHandle, y: y + height / 2 - halfHandle }, // Middle-Right
    { x: x + width - halfHandle, y: y + height - halfHandle }, // Bottom-Right
    { x: x + width / 2 - halfHandle, y: y + height - halfHandle }, // Bottom-Center
    { x: x - halfHandle, y: y + height - halfHandle }, // Bottom-Left
    { x: x - halfHandle, y: y + height / 2 - halfHandle } // Middle-Left
  ];
  
  // Dessiner chaque poignée
  for (const handle of handles) {
    // Poignée avec coins arrondis
    const radius = 2;
    context.beginPath();
    context.moveTo(handle.x + radius, handle.y);
    context.arcTo(handle.x + handleSize, handle.y, handle.x + handleSize, handle.y + handleSize, radius);
    context.arcTo(handle.x + handleSize, handle.y + handleSize, handle.x, handle.y + handleSize, radius);
    context.arcTo(handle.x, handle.y + handleSize, handle.x, handle.y, radius);
    context.arcTo(handle.x, handle.y, handle.x + handleSize, handle.y, radius);
    context.closePath();
    context.fill();
    context.stroke();
  }
}

/**
 * Dessine la poignée de rotation en tenant compte de la rotation de l'élément
 */
export function drawRotationHandle(
  context: CanvasRenderingContext2D,
  element: AnyPlanElement
): void {
  const { bounds, transform } = element;
  const center = { 
    x: bounds.x + bounds.width / 2, 
    y: bounds.y + bounds.height / 2 
  };
  
  // Position de la poignée de rotation de base (sans rotation)
  const baseHandlePos = calculateRotationHandlePosition(bounds);
  
  // Appliquer la rotation à la position de la poignée
  const handlePos = transform.rotation !== 0 
    ? rotatePoint(baseHandlePos, center, transform.rotation)
    : baseHandlePos;
  
  const halfSize = ROTATION_HANDLE_SIZE / 2;
  
  // Point supérieur centré de l'élément (avec la rotation appliquée)
  const topCenter = transform.rotation !== 0
    ? rotatePoint({ x: center.x, y: bounds.y }, center, transform.rotation)
    : { x: center.x, y: bounds.y };
  
  // Ligne entre le haut de l'élément et la poignée
  context.beginPath();
  context.setLineDash([3, 2]);
  context.moveTo(topCenter.x, topCenter.y);
  context.lineTo(handlePos.x, handlePos.y);
  context.strokeStyle = EDITOR_COLORS.selection;
  context.stroke();
  
  // Dessiner la poignée de rotation (cercle)
  context.beginPath();
  context.setLineDash([]);
  context.arc(handlePos.x, handlePos.y, halfSize, 0, Math.PI * 2);
  context.fillStyle = EDITOR_COLORS.resizeHandleFill;
  context.strokeStyle = EDITOR_COLORS.resizeHandle;
  context.lineWidth = 2;
  context.fill();
  context.stroke();
  
  // Dessiner l'icône de rotation à l'intérieur du cercle
  context.beginPath();
  context.arc(handlePos.x, handlePos.y, halfSize * 0.7, 0, Math.PI * 1.7);
  context.strokeStyle = EDITOR_COLORS.resizeHandle;
  context.lineWidth = 1.5;
  context.stroke();
  
  // Petite flèche pour indiquer la rotation
  const arrowSize = 3;
  context.beginPath();
  context.moveTo(handlePos.x + halfSize * 0.5, handlePos.y);
  context.lineTo(handlePos.x + halfSize * 0.5 - arrowSize, handlePos.y - arrowSize);
  context.lineTo(handlePos.x + halfSize * 0.5 - arrowSize, handlePos.y + arrowSize);
  context.closePath();
  context.fillStyle = EDITOR_COLORS.resizeHandle;
  context.fill();
}

/**
 * Dessine un cadre de sélection multiple
 */
export function drawMultiSelectionBox(
  context: CanvasRenderingContext2D,
  startPoint: Vector2D,
  endPoint: Vector2D
): void {
  const x = Math.min(startPoint.x, endPoint.x);
  const y = Math.min(startPoint.y, endPoint.y);
  const width = Math.abs(endPoint.x - startPoint.x);
  const height = Math.abs(endPoint.y - startPoint.y);
  
  // Dessiner le rectangle de sélection avec coins arrondis
  const radius = 4;
  
  // Remplissage semi-transparent
  context.fillStyle = EDITOR_COLORS.selectionFill;
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
  context.fill();
  
  // Dessiner la bordure
  context.strokeStyle = EDITOR_COLORS.selection;
  context.lineWidth = 2;
  context.setLineDash([5, 3]);
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
  context.stroke();
  context.setLineDash([]);
}