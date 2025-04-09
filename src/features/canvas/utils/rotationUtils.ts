import { Vector2D } from '@/types/geometry';
import { AnyPlanElement } from '@/types/elements';
import { 
  calculateRotationHandlePosition, 
  isPointInRotationHandle,
  rotatePoint
} from '@/lib/utils/rotationUtils';

/**
 * Vérifie si le point est sur la poignée de rotation d'un élément
 */
export function isRotationHandleAtPosition(
  position: Vector2D,
  element: AnyPlanElement
): boolean {
  // Position de base de la poignée (sans rotation)
  const baseHandlePos = calculateRotationHandlePosition(element.bounds);
  
  // Calcul du centre de l'élément
  const center = {
    x: element.bounds.x + element.bounds.width / 2,
    y: element.bounds.y + element.bounds.height / 2
  };
  
  // Si l'élément est pivoté, nous devons pivoter la position de la poignée
  const handlePos = element.transform.rotation !== 0
    ? rotatePoint(
        baseHandlePos,
        center,
        element.transform.rotation
      )
    : baseHandlePos;
  
  // Vérifier si le point est dans la poignée
  return isPointInRotationHandle(position, handlePos);
}

/**
 * Calcule la rotation d'un élément en fonction des positions de la souris
 */
export function rotateElement(
  element: AnyPlanElement,
  center: Vector2D,
  startPoint: Vector2D,
  currentPoint: Vector2D,
  snapToInterval: boolean = false
): number {
  // Calculer les angles
  const startAngle = Math.atan2(startPoint.y - center.y, startPoint.x - center.x);
  const currentAngle = Math.atan2(currentPoint.y - center.y, currentPoint.x - center.x);
  
  // Calculer la différence d'angle en degrés
  const deltaAngle = (currentAngle - startAngle) * (180 / Math.PI);
  
  // Ajouter la rotation actuelle de l'élément
  let newRotation = element.transform.rotation + deltaAngle;
  
  // Normaliser la rotation entre 0 et 360 degrés
  newRotation = ((newRotation % 360) + 360) % 360;
  
  // Aligner sur des intervalles de 15 degrés si demandé (avec Shift)
  if (snapToInterval) {
    newRotation = Math.round(newRotation / 15) * 15;
  }
  
  return newRotation;
}