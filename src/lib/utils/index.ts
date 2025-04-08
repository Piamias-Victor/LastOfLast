import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Vector2D } from "@/types/geometry";

/**
 * Combine les classes CSS avec clsx et tailwind-merge pour éviter les conflits
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Génère un identifiant unique
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Convertit une valeur en pixels
 */
export function px(value: number): string {
  return `${value}px`;
}

/**
 * Arrondit un nombre à une précision donnée
 */
export function roundTo(num: number, precision: number = 0): number {
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
}

/**
 * Limite une valeur entre min et max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Aligne une valeur sur la grille
 */
export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Aligne un point sur la grille
 */
export function snapPointToGrid(point: Vector2D, gridSize: number): Vector2D {
  return {
    x: snapToGrid(point.x, gridSize),
    y: snapToGrid(point.y, gridSize),
  };
}

/**
 * Calcule la distance entre deux points
 */
export function distanceBetween(p1: Vector2D, p2: Vector2D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Vérifie si un point est à l'intérieur d'un rectangle
 */
export function isPointInRect(
  point: Vector2D,
  rect: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}