import React from 'react';
import { X } from 'lucide-react';
import { Dialog } from 'radix-ui';
import { cn } from '@/lib/cn';

interface ModalProps { open: boolean; onClose: () => void; title: string; size?: 'md' | 'lg'; footer?: React.ReactNode; children: React.ReactNode; }

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, size = 'md', footer, children }) => (
  <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
    <Dialog.Portal>
      <Dialog.Overlay className="dialog-overlay fixed inset-0 z-50 bg-black/65" />
      <Dialog.Content aria-describedby={undefined} className={cn(
        'dialog-content fixed inset-x-2 bottom-2 z-[51] grid max-h-[calc(100dvh-1rem-env(safe-area-inset-top))] w-auto grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-[30px] border border-border bg-surface-raised p-0 text-ink shadow-2xl outline-none sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100%-2rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[28px]',
        size === 'lg' ? 'sm:max-w-4xl' : 'sm:max-w-lg',
      )}>
        <div className="flex min-w-0 items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
          <Dialog.Title className="min-w-0 break-words font-display text-2xl font-bold uppercase leading-none sm:text-3xl">{title}</Dialog.Title>
          <Dialog.Close className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border text-ink hover:bg-surface focus-ring" aria-label="Cerrar"><X className="h-5 w-5" /></Dialog.Close>
        </div>
        <div className="min-h-0 overflow-x-hidden overflow-y-auto p-5 scrollbar-subtle sm:p-6">{children}</div>
        {footer && <div className="border-t border-border bg-surface-raised px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-6 sm:pb-4">{footer}</div>}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

Modal.displayName = 'Modal';
