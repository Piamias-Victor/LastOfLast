import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useEditorStore } from '@/store';
import { CanvasDimensions, PresetCanvasSize, CanvasUnit } from '@/types/canvas';

/**
 * Formats prédéfinis pour le canvas
 */
const PRESET_SIZES: PresetCanvasSize[] = [
  { name: "Petite pharmacie", width: 800, height: 600, description: "60-80m²" },
  { name: "Moyenne pharmacie", width: 1200, height: 900, description: "100-150m²" },
  { name: "Grande pharmacie", width: 1600, height: 1200, description: "200-300m²" },
  { name: "A4 Paysage", width: 1123, height: 794, description: "29.7 × 21cm" },
  { name: "A3 Paysage", width: 1587, height: 1123, description: "42 × 29.7cm" },
];

/**
 * Facteurs de conversion pour les unités
 */
const UNIT_FACTORS: Record<CanvasUnit, number> = {
  'px': 1,
  'cm': 10, // 10px = 1cm
  'm': 1000 // 1000px = 1m
};

interface CanvasSizePanelProps {
  onClose?: () => void;
}

/**
 * Panneau de configuration des dimensions du canvas - version simplifiée
 */
const CanvasSizePanel: React.FC<CanvasSizePanelProps> = ({ onClose }) => {
  const { canvasDimensions, canvasUnit, pixelsPerUnit, setCanvasDimensions, setCanvasUnit, setPixelsPerUnit } = useEditorStore();
  
  // État local pour stocker les dimensions modifiées avant de les appliquer
  const [localDimensions, setLocalDimensions] = useState<CanvasDimensions>({
    width: canvasDimensions.width,
    height: canvasDimensions.height
  });
  
  // État local pour stocker l'unité sélectionnée
  const [localUnit, setLocalUnit] = useState<CanvasUnit>(canvasUnit);
  
  // État pour maintenir le ratio d'aspect
  const [maintainRatio, setMaintainRatio] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(canvasDimensions.width / canvasDimensions.height);
  
  // État pour afficher les préréglages ou les dimensions personnalisées
  const [showPresets, setShowPresets] = useState<boolean>(false);

  // Mettre à jour l'état local lorsque les props changent
  useEffect(() => {
    setLocalDimensions(canvasDimensions);
    setLocalUnit(canvasUnit);
    setAspectRatio(canvasDimensions.width / canvasDimensions.height);
  }, [canvasDimensions, canvasUnit]);

  // Convertir entre pixels et unités réelles
  const toRealUnit = (pixels: number): number => {
    return Number((pixels / UNIT_FACTORS[localUnit]).toFixed(2));
  };
  
  const toPixels = (value: number): number => {
    return Math.round(value * UNIT_FACTORS[localUnit]);
  };

  // Mise à jour de la largeur avec maintien du ratio
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value <= 0) return;
    
    const widthInPixels = toPixels(value);
    
    if (maintainRatio) {
      const heightInPixels = Math.round(widthInPixels / aspectRatio);
      setLocalDimensions({
        width: widthInPixels,
        height: heightInPixels
      });
    } else {
      setLocalDimensions({
        ...localDimensions,
        width: widthInPixels
      });
    }
  };

  // Mise à jour de la hauteur avec maintien du ratio
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value <= 0) return;
    
    const heightInPixels = toPixels(value);
    
    if (maintainRatio) {
      const widthInPixels = Math.round(heightInPixels * aspectRatio);
      setLocalDimensions({
        width: widthInPixels,
        height: heightInPixels
      });
    } else {
      setLocalDimensions({
        ...localDimensions,
        height: heightInPixels
      });
    }
  };

  // Appliquer une taille prédéfinie
  const applyPresetSize = (preset: PresetCanvasSize) => {
    setLocalDimensions({
      width: preset.width,
      height: preset.height
    });
    setAspectRatio(preset.width / preset.height);
  };

  // Appliquer les changements
  const applyChanges = () => {
    setCanvasDimensions(localDimensions);
    setCanvasUnit(localUnit);
    setPixelsPerUnit(UNIT_FACTORS[localUnit]);
    
    if (onClose) {
      onClose();
    }
  };

  // Vérifier si une taille prédéfinie est actuellement sélectionnée
  const isPresetActive = (preset: PresetCanvasSize): boolean => {
    return localDimensions.width === preset.width && localDimensions.height === preset.height;
  };

  // Changer l'unité de mesure
  const handleUnitChange = (unit: CanvasUnit) => {
    setLocalUnit(unit);
  };

  return (
    <div className="space-y-4">
      {/* Onglets simplifiés */}
      <div className="flex border-b border-gray-200">
        <button
          className={`pb-3 px-4 ${!showPresets ? 'text-pharmacy-primary border-b-2 border-pharmacy-primary' : 'text-gray-500'}`}
          onClick={() => setShowPresets(false)}
        >
          Dimensions
        </button>
        <button
          className={`pb-3 px-4 ${showPresets ? 'text-pharmacy-primary border-b-2 border-pharmacy-primary' : 'text-gray-500'}`}
          onClick={() => setShowPresets(true)}
        >
          Formats prédéfinis
        </button>
      </div>
      
      {!showPresets ? (
        <div className="space-y-4">
          {/* Unités de mesure */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Unité de mesure:</span>
            <div className="flex space-x-2">
              {(['px', 'cm', 'm'] as CanvasUnit[]).map((unit) => (
                <button
                  key={unit}
                  className={`px-3 py-1 text-sm rounded ${
                    localUnit === unit 
                      ? 'bg-pharmacy-primary text-white' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => handleUnitChange(unit)}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
          
          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Largeur</label>
              <div className="relative">
                <input
                  type="number"
                  value={toRealUnit(localDimensions.width)}
                  onChange={handleWidthChange}
                  min="1"
                  className="w-full px-3 py-2 border rounded-md pr-12"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                  {localUnit}
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Hauteur</label>
              <div className="relative">
                <input
                  type="number"
                  value={toRealUnit(localDimensions.height)}
                  onChange={handleHeightChange}
                  min="1"
                  className="w-full px-3 py-2 border rounded-md pr-12"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                  {localUnit}
                </div>
              </div>
            </div>
          </div>
          
          {/* Conserver les proportions */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="maintain-ratio"
              checked={maintainRatio}
              onChange={(e) => setMaintainRatio(e.target.checked)}
              className="h-4 w-4 text-pharmacy-primary rounded"
            />
            <label htmlFor="maintain-ratio" className="text-sm">
              Conserver les proportions
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {PRESET_SIZES.map((preset) => (
            <button
              key={preset.name}
              className={`w-full px-4 py-3 text-left border rounded-md ${
                isPresetActive(preset) 
                  ? 'border-pharmacy-primary bg-pharmacy-primary/5' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => applyPresetSize(preset)}
            >
              <div className="text-sm font-medium">{preset.name}</div>
              <div className="text-xs text-gray-500 mt-1">
                {preset.width} × {preset.height}
                {preset.description && ` (${preset.description})`}
              </div>
            </button>
          ))}
        </div>
      )}
      
      {/* Boutons d'action */}
      <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
        <button
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
          onClick={onClose}
        >
          Annuler
        </button>
        <button
          className="px-4 py-2 bg-pharmacy-primary text-white rounded-md hover:bg-pharmacy-primary-dark text-sm"
          onClick={applyChanges}
        >
          Appliquer
        </button>
      </div>
    </div>
  );
};

export default CanvasSizePanel;