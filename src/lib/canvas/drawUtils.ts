import { RectangleElement, AnyPlanElement } from '@/types/elements';
import { EDITOR_COLORS } from '@/lib/constants/editor';
import { Bounds, Vector2D } from '@/types/geometry';

/**
 * Dessine un rectangle sur le canvas
 */
export function drawRectangle(
  context: CanvasRenderingContext2D,
  rectangle: RectangleElement,
  isSelected: boolean = false
): void {
  const { bounds, cornerRadius, backgroundColor, borderColor, borderWidth } = rectangle;
  const { x, y, width, height } = bounds;
  
  // Dessiner le rectangle
  context.save();
  
  // Appliquer la rotation si nécessaire
  if (rectangle.transform.rotation !== 0) {
    // Calculer le centre du rectangle
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    
    // Déplacer le contexte au centre, appliquer la rotation, puis revenir
    context.translate(centerX, centerY);
    context.rotate((rectangle.transform.rotation * Math.PI) / 180);
    context.translate(-centerX, -centerY);
  }
  
  // Dessiner le fond
  context.fillStyle = backgroundColor;
  
  if (cornerRadius) {
    // Rectangle avec coins arrondis
    const radius = Math.min(cornerRadius, Math.min(width, height) / 2);
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
    context.fill();
    
    // Dessiner la bordure si nécessaire
    if (borderColor && borderWidth) {
      context.strokeStyle = borderColor;
      context.lineWidth = borderWidth;
      context.stroke();
    }
  } else {
    // Rectangle normal
    context.fillRect(x, y, width, height);
    
    // Dessiner la bordure si nécessaire
    if (borderColor && borderWidth) {
      context.strokeStyle = borderColor;
      context.lineWidth = borderWidth;
      context.strokeRect(x, y, width, height);
    }
  }
  
  // Si l'élément est sélectionné, dessiner la sélection
  if (isSelected) {
    drawSelectionIndicator(context, bounds);
  }
  
  context.restore();
}

/**
 * Dessine un indicateur de sélection autour d'une zone
 */
export function drawSelectionIndicator(
  context: CanvasRenderingContext2D,
  bounds: Bounds
): void {
  const { x, y, width, height } = bounds;
  const padding = 5; // Augmenté pour une meilleure visibilité
  
  // Dessiner le cadre de sélection
  context.strokeStyle = EDITOR_COLORS.selection;
  context.lineWidth = 2; // Ligne plus épaisse
  context.setLineDash([5, 3]);
  context.strokeRect(
    x - padding,
    y - padding,
    width + padding * 2,
    height + padding * 2
  );
  
  // Dessiner les poignées de redimensionnement
  context.setLineDash([]);
  context.fillStyle = EDITOR_COLORS.resizeHandleFill;
  context.strokeStyle = EDITOR_COLORS.resizeHandle;
  context.lineWidth = 2; // Augmenté pour une meilleure visibilité
  
  const handleSize = 12; // Taille augmentée pour faciliter la sélection
  const halfHandle = handleSize / 2;
  
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
    context.beginPath();
    context.rect(handle.x, handle.y, handleSize, handleSize);
    context.fill();
    context.stroke();
  }
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
  
  // Dessiner le rectangle de sélection
  context.fillStyle = EDITOR_COLORS.selectionFill;
  context.fillRect(x, y, width, height);
  
  // Dessiner la bordure du rectangle de sélection
  context.strokeStyle = EDITOR_COLORS.selection;
  context.lineWidth = 2;
  context.setLineDash([5, 3]);
  context.strokeRect(x, y, width, height);
  context.setLineDash([]);
}

/**
 * Dessine tous les éléments du plan
 */
export function drawElements(
  context: CanvasRenderingContext2D,
  elements: AnyPlanElement[],
  selectedElementIds: string[]
): void {
  // Trier les éléments par zIndex
  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);
  
  // Dessiner chaque élément
  for (const element of sortedElements) {
    const isSelected = selectedElementIds.includes(element.id);
    
    switch (element.type) {
      case 'rectangle':
        drawRectangle(context, element as RectangleElement, isSelected);
        break;
      // D'autres types d'éléments seront ajoutés ici plus tard
      default:
        console.warn(`Type d'élément inconnu: ${element.type}`);
    }
  }
}