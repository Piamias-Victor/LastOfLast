'use client';

import { AnyPlanElement, ElementType, RectangleElement, CounterElement, GondolaElement, EndCapElement, BargainBinElement } from '@/types/elements';
import { drawRectangle } from './rectangleDrawing';
import { drawCounter } from './counterDrawing';
import { drawGondola } from './gondolaDrawing';
import { drawEndCap } from './endcapDrawing';
import { drawBargainBin } from './bargainBinDrawing';
import { DrawElementsOptions } from '../types';

/**
 * Dessine tous les éléments du plan
 */
export function drawElements(
  context: CanvasRenderingContext2D,
  elements: AnyPlanElement[],
  selectedElementIds: string[],
  options: DrawElementsOptions = {}
): void {
  const { sortByZIndex = true } = options;
  
  // Préparer les éléments pour le dessin
  let elementsToRender = elements;
  
  // Trier les éléments par zIndex si demandé
  if (sortByZIndex) {
    elementsToRender = [...elements].sort((a, b) => a.zIndex - b.zIndex);
  }
  
  // Dessiner chaque élément
  for (const element of elementsToRender) {
    const isSelected = selectedElementIds.includes(element.id);
    
    switch (element.type) {
      case ElementType.RECTANGLE:
        drawRectangle(context, element as RectangleElement, isSelected);
        break;
      case ElementType.COUNTER:
        drawCounter(context, element as CounterElement, isSelected);
        break;
      case ElementType.GONDOLA:
        drawGondola(context, element as GondolaElement, isSelected);
        break;
      case ElementType.END_CAP:
        drawEndCap(context, element as EndCapElement, isSelected);
        break;
      case ElementType.BARGAIN_BIN:
        drawBargainBin(context, element as BargainBinElement, isSelected);
        break;
      // D'autres types d'éléments seront ajoutés ici plus tard
      default:
        console.warn(`Type d'élément inconnu: ${element.type}`);
    }
  }
}