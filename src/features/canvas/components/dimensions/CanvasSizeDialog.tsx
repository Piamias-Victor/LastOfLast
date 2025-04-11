import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { Button } from "@/components/ui/button";
import CanvasSizePanel from './CanvasSizePanel';

interface CanvasSizeDialogProps {
  trigger?: React.ReactNode;
  className?: string;
}

/**
 * Dialogue pour configurer les dimensions du canvas - utilisant un portal React
 */
const CanvasSizeDialog: React.FC<CanvasSizeDialogProps> = ({
  trigger,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      {/* Bouton déclencheur */}
      {trigger || (
        <Button 
          variant="outline" 
          size="sm"
          className={className}
          onClick={handleOpen}
        >
          <svg 
            className="mr-2 h-4 w-4" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
            <line x1="15" y1="3" x2="15" y2="21" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="3" y1="15" x2="21" y2="15" />
          </svg>
          Dimensions du plan
        </Button>
      )}

      {/* Modal utilisant un portail React */}
      <Modal isOpen={isOpen} onClose={handleClose} title="Dimensions du plan">
        <CanvasSizePanel onClose={handleClose} />
      </Modal>
    </>
  );
};

export default CanvasSizeDialog;