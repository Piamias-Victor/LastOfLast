import { Vector2D } from '@/types/geometry';
import { Bounds } from '@/types/geometry';

/**
 * Distance entre la poignée de rotation et le bord de l'élément en pixels
 */
export const ROTATION_HANDLE_OFFSET = 30;

/**
 * Taille de la poignée de rotation en pixels
 */
export const ROTATION_HANDLE_SIZE = 14;

/**
 * Calcule la position de la poignée de rotation
 * La poignée est placée au-dessus du centre supérieur de l'élément
 */
export function calculateRotationHandlePosition(bounds: Bounds): Vector2D {
  const center = {
    x: bounds.x + bounds.width / 2,
    y: bounds.y
  };
  
  return {
    x: center.x,
    y: center.y - ROTATION_HANDLE_OFFSET
  };
}

/**
 * Vérifie si un point se trouve dans la zone de la poignée de rotation
 */
export function isPointInRotationHandle(
  point: Vector2D,
  handlePosition: Vector2D,
  handleSize = ROTATION_HANDLE_SIZE
): boolean {
  const halfSize = handleSize / 2;
  return (
    point.x >= handlePosition.x - halfSize &&
    point.x <= handlePosition.x + halfSize &&
    point.y >= handlePosition.y - halfSize &&
    point.y <= handlePosition.y + halfSize
  );
}

/**
 * Calcule l'angle de rotation à partir d'un point central et d'un point de référence
 */
export function calculateRotationAngle(
  center: Vector2D,
  point: Vector2D
): number {
  return Math.atan2(point.y - center.y, point.x - center.x) * (180 / Math.PI);
}

/**
 * Calcule l'angle de rotation entre la position de départ et la position actuelle
 */
export function calculateRotationDelta(
  center: Vector2D,
  startPoint: Vector2D,
  currentPoint: Vector2D
): number {
  const startAngle = calculateRotationAngle(center, startPoint);
  const currentAngle = calculateRotationAngle(center, currentPoint);
  return currentAngle - startAngle;
}

/**
 * Arrondit un angle à l'intervalle spécifié si la touche Shift est enfoncée
 */
export function snapAngleToInterval(
  angle: number,
  interval: number = 15,
  shouldSnap: boolean = false
): number {
  if (!shouldSnap) return angle;
  return Math.round(angle / interval) * interval;
}

/**
 * Fait pivoter un point autour d'un centre
 */
export function rotatePoint(
  point: Vector2D,
  center: Vector2D,
  angleDegrees: number
): Vector2D {
  // Convertir les degrés en radians
  const angleRadians = (angleDegrees * Math.PI) / 180;
  
  // Traduire le point au centre
  const translatedX = point.x - center.x;
  const translatedY = point.y - center.y;
  
  // Effectuer la rotation
  const cosTheta = Math.cos(angleRadians);
  const sinTheta = Math.sin(angleRadians);
  const rotatedX = translatedX * cosTheta - translatedY * sinTheta;
  const rotatedY = translatedX * sinTheta + translatedY * cosTheta;
  
  // Traduire le point à sa position d'origine
  return {
    x: rotatedX + center.x,
    y: rotatedY + center.y
  };
}

/**
 * Fait pivoter un vecteur (sans point de référence central)
 */
export function rotateVector(
  vector: Vector2D,
  angleDegrees: number
): Vector2D {
  // Convertir les degrés en radians
  const angleRadians = (angleDegrees * Math.PI) / 180;
  
  // Effectuer la rotation du vecteur
  const cosTheta = Math.cos(angleRadians);
  const sinTheta = Math.sin(angleRadians);
  
  return {
    x: vector.x * cosTheta - vector.y * sinTheta,
    y: vector.x * sinTheta + vector.y * cosTheta
  };
}

/**
 * Normalise un angle en degrés pour qu'il soit entre 0 et 360
 */
export function normalizeAngle(angleDegrees: number): number {
  return ((angleDegrees % 360) + 360) % 360;
}