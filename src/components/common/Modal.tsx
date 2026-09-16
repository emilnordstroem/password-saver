import React, { useEffect, useCallback } from 'react';
import { Modal as NextUIModal, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalProps as NextUIModalProps, useDisclosure } from '@nextui-org/react';

interface ModalProps extends Partial<NextUIModalProps> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
  showCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  footer?: React.ReactNode;
}

/**
 * Modal - Reusable modal component
 * Wrapper around NextUI Modal with consistent defaults
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  footer,
  ...props
}: ModalProps) {
  // Handle escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape' && isOpen) {
        onClose();
      }
    },
    [closeOnEscape, isOpen, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <NextUIModal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      hideCloseButton={!showCloseButton}
      backdrop="blur"
      classNames={{
        backdrop: 'modal-backdrop',
        base: 'modal-base',
        wrapper: 'modal-wrapper',
      }}
      {...props}
    >
      <ModalContent
        onClick={handleBackdropClick}
        className="modal-content"
      >
        {title && (
          <ModalHeader className="modal-header">
            <h2 className="modal-title">{title}</h2>
          </ModalHeader>
        )}
        
        <ModalBody className="modal-body">
          {children}
        </ModalBody>
        
        {footer && (
          <ModalFooter className="modal-footer">
            {footer}
          </ModalFooter>
        )}
      </ModalContent>
    </NextUIModal>
  );
}

// Hook for easier modal management
export function useModal() {
  return useDisclosure();
}

export default Modal;
