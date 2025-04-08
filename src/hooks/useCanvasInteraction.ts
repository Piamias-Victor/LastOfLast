import { useCallback, useRef, useState } from 'react';
import { useEditorStore } from '@/states/editorStore';
import { ElementOperation } from '@/states/editorStore';
import { isPointInRect, snapPointToGrid } from '@/lib/utils';
import { AnyPlanElement } from '@/types/elements';
import { ResizeHandle, Vector2D } from '@/types/geometry';
import { drawMultiSelectionBox } from '@/lib/canvas/drawUtils';
import { RESIZE_HANDLE_SIZE } from '@/lib/constants/editor';
import { getCursor } from '@/lib/utils/cursorUtils';

/**
 * Hook pour gérer les interactions avec le canvas
 */
export function useCanvasInteraction(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const {
    elements,
    selectedElementIds,
    selectElement,
    deselectAll,
    updateElement,
    startOperation,
    endOperation,
    currentOperation,
    operationStartPoint,
    activeResizeHandle,
    snapToGrid,
    gridSize,
    zoom,
    viewportOffset,
  } = useEditorStore();

  // Référence à l'élément en cours de déplacement/redimensionnement
  const activeElementRef = useRef<string | null>(null);
  
  // État pour le style du curseur
  const [cursor, setCursor] = useState('default');
  
  // État pour la poignée en survol
  const [hoveredResizeHandle, setHoveredResizeHandle] = useState<ResizeHandle | null>(null);
  
  // État du rectangle de sélection
  const [selectionBox, setSelectionBox] = useState<{
    start: Vector2D | null;
    end: Vector2D | null;
  }>({
    start: null,
    end: null,
  });

  /**
   * Convertit les coordonnées de l'écran en coordonnées du canvas
   */
  const screenToCanvasCoordinates = useCallback(
    (screenX: number, screenY: number): Vector2D => {
      if (!canvasRef.current) return { x: 0, y: 0 };

      const rect = canvasRef.current.getBoundingClientRect();
      const x = (screenX - rect.left - viewportOffset.x) / zoom;
      const y = (screenY - rect.top - viewportOffset.y) / zoom;

      return { x, y };
    },
    [zoom, viewportOffset, canvasRef]
  );

  /**
   * Trouve l'élément sous un point donné
   */
  const findElementAtPosition = useCallback(
    (position: Vector2D): AnyPlanElement | null => {
      // Parcourir les éléments du dernier au premier (ordre d'affichage)
      for (let i = elements.length - 1; i >= 0; i--) {
        const element = elements[i];
        if (!element.isVisible) continue;

        // Vérifier si le point est dans l'élément
        if (isPointInRect(position, element.bounds)) {
          return element;
        }
      }
      return null;
    },
    [elements]
  );

  /**
   * Trouve tous les éléments dans une zone rectangulaire
   */
  const findElementsInArea = useCallback(
    (start: Vector2D, end: Vector2D): AnyPlanElement[] => {
      const selectionArea = {
        x: Math.min(start.x, end.x),
        y: Math.min(start.y, end.y),
        width: Math.abs(end.x - start.x),
        height: Math.abs(end.y - start.y),
      };
      
      return elements.filter((element) => {
        if (!element.isVisible) return false;
        
        const elementBounds = element.bounds;
        
        // Vérifier si l'élément est au moins partiellement dans la zone de sélection
        return (
          elementBounds.x < selectionArea.x + selectionArea.width &&
          elementBounds.x + elementBounds.width > selectionArea.x &&
          elementBounds.y < selectionArea.y + selectionArea.height &&
          elementBounds.y + elementBounds.height > selectionArea.y
        );
      });
    },
    [elements]
  );

  /**
   * Vérifie si un point est sur une poignée de redimensionnement d'un élément
   */
  const getResizeHandleAtPosition = useCallback(
    (position: Vector2D, element: AnyPlanElement): ResizeHandle | null => {
      const { bounds } = element;
      const { x, y, width, height } = bounds;
      
      // Taille de la zone de poignée
      const handleSize = RESIZE_HANDLE_SIZE;
      const halfHandle = handleSize / 2;
      
      // Zone de détection agrandie pour faciliter la sélection
      const hitAreaPadding = 4; // Détection plus large que la poignée visible
      
      // Calculer les positions des poignées
      const handles = [
        { handle: ResizeHandle.TopLeft, x: x - halfHandle, y: y - halfHandle },
        { handle: ResizeHandle.Top, x: x + width / 2 - halfHandle, y: y - halfHandle },
        { handle: ResizeHandle.TopRight, x: x + width - halfHandle, y: y - halfHandle },
        { handle: ResizeHandle.Right, x: x + width - halfHandle, y: y + height / 2 - halfHandle },
        { handle: ResizeHandle.BottomRight, x: x + width - halfHandle, y: y + height - halfHandle },
        { handle: ResizeHandle.Bottom, x: x + width / 2 - halfHandle, y: y + height - halfHandle },
        { handle: ResizeHandle.BottomLeft, x: x - halfHandle, y: y + height - halfHandle },
        { handle: ResizeHandle.Left, x: x - halfHandle, y: y + height / 2 - halfHandle },
      ];
      
      // Vérifier si le point est sur une poignée
      for (const handleData of handles) {
        if (
          position.x >= handleData.x - hitAreaPadding &&
          position.x <= handleData.x + handleSize + hitAreaPadding &&
          position.y >= handleData.y - hitAreaPadding &&
          position.y <= handleData.y + handleSize + hitAreaPadding
        ) {
          return handleData.handle;
        }
      }
      
      return null;
    },
    []
  );

  /**
   * Dessine le rectangle de sélection
   */
  const drawSelectionBox = useCallback(() => {
    if (!selectionBox.start || !selectionBox.end || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Sauvegarder le contexte pour appliquer les transformations
    context.save();
    
    // Appliquer les transformations du canvas (zoom et offset)
    context.translate(viewportOffset.x, viewportOffset.y);
    context.scale(zoom, zoom);
    
    // Dessiner le rectangle de sélection
    drawMultiSelectionBox(context, selectionBox.start, selectionBox.end);
    
    // Restaurer le contexte
    context.restore();
  }, [selectionBox, viewportOffset, zoom, canvasRef]);

  /**
   * Gestionnaire de mouvement de souris pour mettre à jour le curseur
   */
  const handleMouseMoveForCursor = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      // Si une opération est en cours, le curseur est déjà géré
      if (currentOperation !== ElementOperation.None) return;
      
      // Coordonnées actuelles dans le canvas
      const currentPosition = screenToCanvasCoordinates(e.clientX, e.clientY);
      
      // Vérifier si on survole un élément sélectionné
      if (selectedElementIds.length === 1) {
        const selectedElement = elements.find(el => el.id === selectedElementIds[0]);
        if (selectedElement) {
          // Vérifier si on survole une poignée de redimensionnement
          const resizeHandle = getResizeHandleAtPosition(currentPosition, selectedElement);
          
          if (resizeHandle) {
            // On survole une poignée, mettre à jour le curseur
            setHoveredResizeHandle(resizeHandle);
            setCursor(getCursor(ElementOperation.Resize, resizeHandle));
            return;
          }
        }
      }
      
      // Vérifier si on survole un élément (pour le déplacement)
      const hoveredElement = findElementAtPosition(currentPosition);
      if (hoveredElement) {
        setCursor('move');
      } else {
        // Aucun élément ou poignée survolé
        setCursor('default');
        setHoveredResizeHandle(null);
      }
    },
    [
      currentOperation,
      screenToCanvasCoordinates,
      selectedElementIds,
      elements,
      getResizeHandleAtPosition,
      findElementAtPosition
    ]
  );

  /**
   * Gestionnaire d'événement pour le début d'une interaction
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      // Coordonnées du clic dans le canvas
      const position = screenToCanvasCoordinates(e.clientX, e.clientY);

      // Vérifier si le clic est sur une poignée de redimensionnement d'un élément sélectionné
      if (selectedElementIds.length === 1) {
        const selectedElement = elements.find(el => el.id === selectedElementIds[0]);
        if (selectedElement) {
          const resizeHandle = getResizeHandleAtPosition(position, selectedElement);
          if (resizeHandle) {
            // Commencer une opération de redimensionnement
            activeElementRef.current = selectedElement.id;
            startOperation(ElementOperation.Resize, position, resizeHandle);
            return;
          }
        }
      }

      // Trouver l'élément sous le clic
      const clickedElement = findElementAtPosition(position);

      if (clickedElement) {
        // Vérifier si on maintient la touche Shift pour la sélection multiple
        if (e.shiftKey) {
          // Si l'élément est déjà sélectionné, le désélectionner
          if (selectedElementIds.includes(clickedElement.id)) {
            const newSelectedIds = selectedElementIds.filter(id => id !== clickedElement.id);
            deselectAll();
            newSelectedIds.forEach(id => selectElement(id));
          } else {
            // Sinon, l'ajouter à la sélection
            selectElement(clickedElement.id);
          }
        } else if (!selectedElementIds.includes(clickedElement.id)) {
          // Si l'élément n'était pas déjà sélectionné, désélectionner tout et sélectionner celui-ci
          deselectAll();
          selectElement(clickedElement.id);
        }

        // Commencer l'opération de déplacement
        activeElementRef.current = clickedElement.id;
        startOperation(ElementOperation.Move, position);
      } else {
        // Clic dans le vide, commencer un rectangle de sélection
        // sauf si on maintient la touche Shift
        if (!e.shiftKey) {
          deselectAll();
        }
        
        // Initialiser le rectangle de sélection
        setSelectionBox({
          start: position,
          end: position,
        });
      }
    },
    [
      screenToCanvasCoordinates,
      selectedElementIds,
      elements,
      getResizeHandleAtPosition,
      findElementAtPosition,
      deselectAll,
      selectElement,
      startOperation,
    ]
  );

  /**
   * Redimensionne un élément
   */
  const resizeElement = useCallback(
    (element: AnyPlanElement, startPoint: Vector2D, currentPoint: Vector2D, handle: ResizeHandle) => {
      const { bounds } = element;
      const originalX = bounds.x;
      const originalY = bounds.y;
      const originalWidth = bounds.width;
      const originalHeight = bounds.height;
      
      // Calculer les différences
      const dx = currentPoint.x - startPoint.x;
      const dy = currentPoint.y - startPoint.y;
      
      // Nouvelles valeurs
      let newX = originalX;
      let newY = originalY;
      let newWidth = originalWidth;
      let newHeight = originalHeight;
      
      // Modifier les valeurs selon la poignée utilisée
      switch (handle) {
        case ResizeHandle.TopLeft:
          newX = originalX + dx;
          newY = originalY + dy;
          newWidth = originalWidth - dx;
          newHeight = originalHeight - dy;
          break;
        case ResizeHandle.Top:
          newY = originalY + dy;
          newHeight = originalHeight - dy;
          break;
        case ResizeHandle.TopRight:
          newY = originalY + dy;
          newWidth = originalWidth + dx;
          newHeight = originalHeight - dy;
          break;
        case ResizeHandle.Right:
          newWidth = originalWidth + dx;
          break;
        case ResizeHandle.BottomRight:
          newWidth = originalWidth + dx;
          newHeight = originalHeight + dy;
          break;
        case ResizeHandle.Bottom:
          newHeight = originalHeight + dy;
          break;
        case ResizeHandle.BottomLeft:
          newX = originalX + dx;
          newWidth = originalWidth - dx;
          newHeight = originalHeight + dy;
          break;
        case ResizeHandle.Left:
          newX = originalX + dx;
          newWidth = originalWidth - dx;
          break;
      }
      
      // Assurer que les dimensions restent positives
      if (newWidth < 10) {
        newWidth = 10;
        if ([ResizeHandle.TopLeft, ResizeHandle.Left, ResizeHandle.BottomLeft].includes(handle)) {
          newX = originalX + originalWidth - 10;
        }
      }
      
      if (newHeight < 10) {
        newHeight = 10;
        if ([ResizeHandle.TopLeft, ResizeHandle.Top, ResizeHandle.TopRight].includes(handle)) {
          newY = originalY + originalHeight - 10;
        }
      }
      
      // Appliquer la grille si nécessaire
      if (snapToGrid) {
        newX = snapPointToGrid({ x: newX, y: 0 }, gridSize).x;
        newY = snapPointToGrid({ x: 0, y: newY }, gridSize).y;
        newWidth = snapPointToGrid({ x: newWidth, y: 0 }, gridSize).x;
        newHeight = snapPointToGrid({ x: 0, y: newHeight }, gridSize).y;
      }
      
      // Mettre à jour l'élément
      updateElement(element.id, {
        bounds: {
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        },
        transform: {
          ...element.transform,
          position: { x: newX, y: newY },
        },
      });
    },
    [updateElement, snapToGrid, gridSize]
  );

  /**
   * Gestionnaire d'événement pour le déplacement pendant une interaction
   */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      // Mettre à jour le curseur en fonction de la position
      handleMouseMoveForCursor(e);
      
      // Coordonnées actuelles dans le canvas
      const currentPosition = screenToCanvasCoordinates(e.clientX, e.clientY);
      
      // Si un rectangle de sélection est en cours
      if (selectionBox.start) {
        setSelectionBox({
          start: selectionBox.start,
          end: currentPosition,
        });
        
        // Redessiner la scène avec le rectangle de sélection
        requestAnimationFrame(drawSelectionBox);
        return;
      }

      // Si aucune opération n'est en cours, sortir
      if (currentOperation === ElementOperation.None || !operationStartPoint) return;

      if (currentOperation === ElementOperation.Resize && activeResizeHandle && activeElementRef.current) {
        // Redimensionnement
        const elementId = activeElementRef.current;
        const element = elements.find((el) => el.id === elementId);
        
        if (element) {
          resizeElement(element, operationStartPoint, currentPosition, activeResizeHandle);
          
          // Mettre à jour le point de départ pour le prochain mouvement
          startOperation(ElementOperation.Resize, currentPosition, activeResizeHandle);
        }
      } else if (currentOperation === ElementOperation.Move) {
        // Déplacement
        // Calculer le décalage depuis le début de l'opération
        const deltaX = currentPosition.x - operationStartPoint.x;
        const deltaY = currentPosition.y - operationStartPoint.y;
        
        // Vérifier si on déplace plusieurs éléments
        if (selectedElementIds.length > 1) {
          // Déplacer tous les éléments sélectionnés
          selectedElementIds.forEach(id => {
            const element = elements.find(el => el.id === id);
            if (element) {
              // Calculer la nouvelle position
              let newX = element.bounds.x + deltaX;
              let newY = element.bounds.y + deltaY;

              // Appliquer la grille si nécessaire
              if (snapToGrid) {
                newX = snapPointToGrid({ x: newX, y: 0 }, gridSize).x;
                newY = snapPointToGrid({ x: 0, y: newY }, gridSize).y;
              }

              // Mettre à jour l'élément
              updateElement(id, {
                bounds: {
                  ...element.bounds,
                  x: newX,
                  y: newY,
                },
                transform: {
                  ...element.transform,
                  position: { x: newX, y: newY },
                },
              });
            }
          });
        } else if (activeElementRef.current) {
          // Obtenir l'élément en mouvement
          const elementId = activeElementRef.current;
          const element = elements.find((el) => el.id === elementId);

          if (element) {
            // Calculer la nouvelle position
            let newX = element.bounds.x + deltaX;
            let newY = element.bounds.y + deltaY;

            // Appliquer la grille si nécessaire
            if (snapToGrid) {
              newX = snapPointToGrid({ x: newX, y: 0 }, gridSize).x;
              newY = snapPointToGrid({ x: 0, y: newY }, gridSize).y;
            }

            // Mettre à jour l'élément
            updateElement(elementId, {
              bounds: {
                ...element.bounds,
                x: newX,
                y: newY,
              },
              transform: {
                ...element.transform,
                position: { x: newX, y: newY },
              },
            });
          }
        }

        // Mettre à jour le point de départ pour le prochain mouvement
        startOperation(ElementOperation.Move, currentPosition);
      }
    },
    [
      handleMouseMoveForCursor,
      screenToCanvasCoordinates,
      selectionBox,
      drawSelectionBox,
      currentOperation,
      operationStartPoint,
      activeResizeHandle,
      activeElementRef,
      resizeElement,
      selectedElementIds,
      elements,
      updateElement,
      snapToGrid,
      gridSize,
      startOperation,
    ]
  );

  /**
   * Gestionnaire d'événement pour la fin d'une interaction
   */
  const handleMouseUp = useCallback(() => {
    // Si un rectangle de sélection est en cours
    if (selectionBox.start && selectionBox.end) {
      // Trouver tous les éléments dans la zone de sélection
      const elementsInSelection = findElementsInArea(selectionBox.start, selectionBox.end);
      
      // Sélectionner ces éléments
      if (elementsInSelection.length > 0) {
        elementsInSelection.forEach(element => {
          selectElement(element.id);
        });
      }
      
      // Réinitialiser le rectangle de sélection
      setSelectionBox({ start: null, end: null });
    }
    
    // Terminer l'opération en cours
    if (currentOperation !== ElementOperation.None) {
      endOperation();
      activeElementRef.current = null;
    }
  }, [
    selectionBox, 
    findElementsInArea, 
    selectElement, 
    currentOperation, 
    endOperation
  ]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    selectionBox,
    cursor
  };
}