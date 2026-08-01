import React, { useEffect } from 'react';
import { cn } from '@/lib/cn';
import { Card, CardHeader, CardBody, CardFooter } from './Card';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  size?: 'md' | 'lg';
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, size = 'md', footer, children }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const sizeClasses = {
    md: 'max-w-md',
    lg: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
      <Card
        className={cn('w-full', sizeClasses[size])}
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="text-ink-soft hover:text-ink"
          >
            ✕
          </button>
        </CardHeader>
        <CardBody>{children}</CardBody>
        {footer && <CardFooter>{footer}</CardFooter>}
      </Card>
      <div onClick={onClose} className="fixed inset-0 -z-10" />
    </div>
  );
};

Modal.displayName = 'Modal';
