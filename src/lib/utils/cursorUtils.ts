import { ElementOperation } from '@/store';
import { ResizeHandle } from '@/types/geometry';

/**
 * Obtient le style de curseur approprié selon l'opération en cours
 */
export function getCursor(
  operation: ElementOperation,
  resizeHandle: ResizeHandle | null = null
): string {
  switch (operation) {
    case ElementOperation.Move:
      return 'move';
    case ElementOperation.Resize:
      if (!resizeHandle) return 'default';
      
      // Curseurs de redimensionnement selon la poignée
      switch (resizeHandle) {
        case ResizeHandle.TopLeft:
        case ResizeHandle.BottomRight:
          return 'nwse-resize';
        case ResizeHandle.TopRight:
        case ResizeHandle.BottomLeft:
          return 'nesw-resize';
        case ResizeHandle.Top:
        case ResizeHandle.Bottom:
          return 'ns-resize';
        case ResizeHandle.Left:
        case ResizeHandle.Right:
          return 'ew-resize';
      }
      break;
    case ElementOperation.Rotate:
      return 'grab'; // Curseur de rotation
    default:
      return 'default';
  }
}