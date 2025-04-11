import React from 'react';
import { Button } from "@/components/ui/button";
import { PresetCanvasSize } from '@/types/canvas';
import { cn } from '@/lib/utils';

interface PresetSizeButtonProps {
  preset: PresetCanvasSize;
  isActive: boolean;
  onClick: () => void;
}

/**
 * Bouton pour sélectionner un format prédéfini de canvas
 */
const PresetSizeButton: React.FC<PresetSizeButtonProps> = ({
  preset,
  isActive,
  onClick
}) => {
  return (
    <Button
      type="button"
      variant={isActive ? "default" : "outline"}
      className={cn(
        "flex flex-col items-start h-auto py-3 px-4 gap-1 w-full",
        isActive && "border-pharmacy-primary text-pharmacy-primary bg-pharmacy-primary/5"
      )}
      onClick={onClick}
    >
      <span className="text-sm font-medium">{preset.name}</span>
      <div className="flex items-center text-xs text-gray-500">
        <span>{preset.width} × {preset.height}</span>
        {preset.description && (
          <span className="ml-2 opacity-70">({preset.description})</span>
        )}
      </div>
    </Button>
  );
};

export default PresetSizeButton;