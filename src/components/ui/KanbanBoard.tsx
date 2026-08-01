import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { fadeUp, softScale, staggerContainer } from '@/lib/motion';
import { Trash2, Flame, GripVertical } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface KanbanColumnDef {
  id: string;
  title: string;
  accentClass?: string;
  dotClass?: string;
}

export interface KanbanBoardProps<TItem> {
  columns: KanbanColumnDef[];
  items: TItem[];
  getItemId: (item: TItem) => string;
  getItemColumn: (item: TItem) => string;
  getItemPosition?: (item: TItem) => number;
  renderItem: (item: TItem, isDragging: boolean) => React.ReactNode;
  isDraggable?: (item: TItem) => boolean;
  canDrop?: (item: TItem, columnId: string) => boolean;
  onDrop: (item: TItem, columnId: string) => void;
  onReorder?: (item: TItem, columnId: string, toIndex: number) => void;
  onDeleteDrop?: (item: TItem) => void;
  renderEmpty?: (columnId: string) => React.ReactNode;
  isLoading?: boolean;
  renderSkeleton?: () => React.ReactNode;
  className?: string;
  deleteZoneLabel?: string;
}

interface DragState {
  itemId: string;
  fromColumn: string;
  pointerId: number;
  pointerX: number;
  pointerY: number;
}

const END_INDICATOR = '__end__';

function DropIndicator({ before, column }: { before: string; column: string }) {
  return (
    <div
      data-before={before}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-brand opacity-0 transition-opacity pointer-events-none"
    />
  );
}

function getNearestIndicator(clientY: number, indicators: HTMLElement[]): HTMLElement | null {
  if (indicators.length === 0) return null;
  return indicators.reduce((nearest, indicator) => {
    const nearestDistance = Math.abs(clientY - nearest.getBoundingClientRect().top);
    const distance = Math.abs(clientY - indicator.getBoundingClientRect().top);
    return distance < nearestDistance ? indicator : nearest;
  });
}

export function KanbanBoard<TItem>({
  columns,
  items,
  getItemId,
  getItemColumn,
  getItemPosition,
  renderItem,
  isDraggable,
  canDrop,
  onDrop,
  onReorder,
  onDeleteDrop,
  renderEmpty,
  isLoading,
  renderSkeleton,
  className,
  deleteZoneLabel = 'Soltar para eliminar',
}: KanbanBoardProps<TItem>): React.ReactElement {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [deleteZoneActive, setDeleteZoneActive] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<number | null>(null);
  const currentColumnRef = useRef<{ element: HTMLElement; id: string } | null>(null);

  const cleanupDrag = useCallback(() => {
    const indicators = Array.from(
      boardRef.current?.querySelectorAll('[data-before][data-column]') || [],
    ) as HTMLElement[];
    indicators.forEach((i) => {
      i.style.opacity = '0';
    });
    setDragState(null);
    setDeleteZoneActive(false);

    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  }, []);

  const getDraggedItem = useCallback(() => {
    if (!dragState) return null;
    return items.find((item) => getItemId(item) === dragState.itemId) || null;
  }, [dragState, items, getItemId]);

  const updateIndicators = useCallback(
    (columnId: string, clientY: number) => {
      const columnElement = boardRef.current?.querySelector(
        `[data-kanban-column="${columnId}"]`,
      ) as HTMLElement | null;
      if (!columnElement) return;

      const indicators = Array.from(
        columnElement.querySelectorAll('[data-before][data-column]'),
      ) as HTMLElement[];

      const nearestIndicator = getNearestIndicator(clientY, indicators);

      indicators.forEach((i) => {
        i.style.opacity = '0';
      });

      if (nearestIndicator) {
        nearestIndicator.style.opacity = '1';
      }
    },
    [],
  );

  const startAutoScroll = useCallback((columnElement: HTMLElement) => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }

    const handleAutoScroll = () => {
      if (!dragState) return;

      const scrollContainer = columnElement.querySelector('.overflow-y-auto') as HTMLElement;
      if (!scrollContainer) return;

      const rect = scrollContainer.getBoundingClientRect();
      const y = dragState.pointerY;

      const TOP_THRESHOLD = 60;
      const BOTTOM_THRESHOLD = 60;
      const SCROLL_SPEED = 8;

      if (y < rect.top + TOP_THRESHOLD && scrollContainer.scrollTop > 0) {
        scrollContainer.scrollTop -= SCROLL_SPEED;
      } else if (
        y > rect.bottom - BOTTOM_THRESHOLD &&
        scrollContainer.scrollTop < scrollContainer.scrollHeight - scrollContainer.clientHeight
      ) {
        scrollContainer.scrollTop += SCROLL_SPEED;
      }
    };

    autoScrollIntervalRef.current = window.setInterval(handleAutoScroll, 16);
  }, [dragState]);

  const handleDragHandlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>, item: TItem) => {
      if (isDraggable && !isDraggable(item)) {
        return;
      }

      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);

      const itemId = getItemId(item);
      const columnId = getItemColumn(item);

      setDragState({
        itemId,
        fromColumn: columnId,
        pointerId: e.pointerId,
        pointerX: e.clientX,
        pointerY: e.clientY,
      });
    },
    [isDraggable, getItemId, getItemColumn],
  );

  const handleDragHandlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!dragState || dragState.pointerId !== e.pointerId) return;

      setDragState((prev) =>
        prev
          ? {
              ...prev,
              pointerX: e.clientX,
              pointerY: e.clientY,
            }
          : null,
      );

      const draggedItem = getDraggedItem();
      if (!draggedItem) return;

      const targetColumn = document.elementFromPoint(
        e.clientX,
        e.clientY,
      ) as HTMLElement | null;
      const columnElement = targetColumn?.closest('[data-kanban-column]') as
        | HTMLElement
        | null;

      if (columnElement) {
        const columnId = columnElement.getAttribute('data-kanban-column');
        if (!columnId) return;

        currentColumnRef.current = { element: columnElement, id: columnId };

        const canDropToColumn = !canDrop || canDrop(draggedItem, columnId);

        if (canDropToColumn) {
          updateIndicators(columnId, e.clientY);
          startAutoScroll(columnElement);
        } else {
          const indicators = Array.from(
            columnElement.querySelectorAll('[data-before][data-column]'),
          ) as HTMLElement[];
          indicators.forEach((i) => {
            i.style.opacity = '0';
          });
        }
      } else {
        const allIndicators = Array.from(
          boardRef.current?.querySelectorAll('[data-before][data-column]') || [],
        ) as HTMLElement[];
        allIndicators.forEach((i) => {
          i.style.opacity = '0';
        });
      }

      const deleteZone = document.elementFromPoint(e.clientX, e.clientY) as
        | HTMLElement
        | null;
      if (deleteZone?.closest('[data-kanban-delete-zone="true"]')) {
        setDeleteZoneActive(true);
      } else {
        setDeleteZoneActive(false);
      }
    },
    [dragState, getDraggedItem, canDrop, updateIndicators, startAutoScroll],
  );

  const handleDragHandlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!dragState || dragState.pointerId !== e.pointerId) return;

      e.currentTarget.releasePointerCapture(e.pointerId);

      const draggedItem = getDraggedItem();
      if (!draggedItem) {
        cleanupDrag();
        return;
      }

      const deleteZone = document.elementFromPoint(
        dragState.pointerX,
        dragState.pointerY,
      ) as HTMLElement | null;

      if (deleteZone?.closest('[data-kanban-delete-zone="true"]')) {
        if (onDeleteDrop) {
          onDeleteDrop(draggedItem);
        }
        cleanupDrag();
        return;
      }

      const targetColumn = document.elementFromPoint(
        dragState.pointerX,
        dragState.pointerY,
      ) as HTMLElement | null;
      const columnElement = targetColumn?.closest('[data-kanban-column]') as
        | HTMLElement
        | null;

      if (!columnElement) {
        cleanupDrag();
        return;
      }

      const columnId = columnElement.getAttribute('data-kanban-column');
      if (!columnId) {
        cleanupDrag();
        return;
      }

      const canDropToColumn = !canDrop || canDrop(draggedItem, columnId);

      if (!canDropToColumn) {
        cleanupDrag();
        return;
      }

      if (dragState.fromColumn === columnId) {
        if (onReorder) {
          const indicators = Array.from(
            columnElement.querySelectorAll('[data-before][data-column]'),
          ) as HTMLElement[];
          const nearestIndicator = getNearestIndicator(dragState.pointerY, indicators);

          if (nearestIndicator) {
            const beforeId = nearestIndicator.getAttribute('data-before');
            const columnItems = items
              .filter((item) => getItemColumn(item) === columnId)
              .sort((a, b) => (getItemPosition?.(a) ?? 0) - (getItemPosition?.(b) ?? 0));

            let toIndex: number;
            if (beforeId === END_INDICATOR) {
              toIndex = columnItems.length;
            } else if (beforeId) {
              const beforeItemIndexInColumn = columnItems.findIndex(
                (item) => getItemId(item) === beforeId,
              );
              toIndex =
                beforeItemIndexInColumn === -1 ? columnItems.length : beforeItemIndexInColumn;
            } else {
              toIndex = 0;
            }

            const currentIndexInColumn = columnItems.findIndex(
              (item) => getItemId(item) === dragState.itemId,
            );

            const adjustedToIndex =
              currentIndexInColumn < toIndex ? toIndex - 1 : toIndex;

            if (adjustedToIndex !== currentIndexInColumn) {
              onReorder(draggedItem, columnId, adjustedToIndex);
            }
          }
        }
      } else {
        onDrop(draggedItem, columnId);
      }

      cleanupDrag();
    },
    [dragState, getDraggedItem, canDrop, onDeleteDrop, onReorder, onDrop, items, getItemId, getItemColumn, cleanupDrag],
  );

  const handleDragHandlePointerCancel = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!dragState || dragState.pointerId !== e.pointerId) return;

      e.currentTarget.releasePointerCapture(e.pointerId);
      cleanupDrag();
    },
    [dragState, cleanupDrag],
  );

  useEffect(() => {
    return () => {
      cleanupDrag();
    };
  }, [cleanupDrag]);

  const draggedItem = getDraggedItem();
  const draggedItemId = dragState?.itemId ?? null;

  return (
    <>
      <motion.div
        ref={boardRef}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className={cn('grid auto-cols-[84vw] grid-flow-col gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-subtle md:grid-flow-row md:grid-cols-2 md:auto-cols-auto xl:grid-cols-4', className)}
      >
        <AnimatePresence initial={false}>
          {draggedItemId !== null && onDeleteDrop && (
          <motion.div
            layout
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="col-span-full"
          >
            <div
              data-kanban-delete-zone="true"
              className={cn(
                'grid place-content-center rounded-card p-6 min-h-32 border-2 border-dashed transition-all',
                deleteZoneActive
                  ? 'border-cancelled bg-cancelled-soft text-cancelled'
                  : 'border-border bg-canvas text-ink-soft',
              )}
            >
              <div className="flex flex-col items-center gap-2">
                {deleteZoneActive && <Flame className="w-5 h-5 animate-pulse" />}
                <Trash2 className="w-5 h-5" />
                <span className="text-sm font-medium text-center">{deleteZoneLabel}</span>
              </div>
            </div>
          </motion.div>
          )}
        </AnimatePresence>

        {columns.map((column) => {
          const columnItems = items
            .filter((item) => getItemColumn(item) === column.id)
            .sort((a, b) => (getItemPosition?.(a) ?? 0) - (getItemPosition?.(b) ?? 0));

          const canDropToColumn =
            !draggedItem ||
            !canDrop ||
            (draggedItem && canDrop(draggedItem, column.id));

          const isValidDropTarget =
            draggedItemId !== null && dragState?.fromColumn !== column.id && canDropToColumn;

          const isInvalidDropTarget =
            draggedItemId !== null && dragState?.fromColumn !== column.id && !canDropToColumn;

          return (
            <motion.div
              key={column.id}
              data-kanban-column={column.id}
              layout
              variants={softScale}
              className={cn(
                'min-h-[420px] snap-start bg-surface border border-border rounded-[24px] flex flex-col overflow-hidden',
                column.accentClass || 'border-t-4 border-t-pending',
                isValidDropTarget && 'ring-2 ring-brand ring-offset-2 border-dashed',
                isInvalidDropTarget && 'opacity-40 cursor-not-allowed',
                'transition-all',
              )}
            >
              <div className="sticky top-0 bg-surface px-4 py-3 border-b border-border flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-2.5 h-2.5 rounded-full',
                      column.dotClass || 'bg-pending',
                    )}
                  />
                  <h3 className="text-sm font-semibold text-ink">{column.title}</h3>
                </div>
                <div className="text-xs font-semibold text-ink-soft bg-canvas rounded-full px-2 py-0.5 min-w-6 text-center">
                  {columnItems.length}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 min-h-[200px]">
                {isLoading ? (
                  <>
                    {renderSkeleton?.()}
                    {renderSkeleton?.()}
                  </>
                ) : columnItems.length === 0 ? (
                  renderEmpty?.(column.id)
                ) : (
                  <>
                    {columnItems.map((item) => {
                      const itemId = getItemId(item);
                      const isDragging = draggedItemId === itemId;
                      const isItemDraggable = !isDraggable || isDraggable(item);

                      return (
                        <div key={itemId}>
                          <DropIndicator before={itemId} column={column.id} />
                          <motion.div
                            layout
                            layoutId={itemId}
                            transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.8 }}
                            className={cn(
                              'relative',
                              isDragging && 'opacity-40',
                            )}
                          >
                            <div className="relative">
                              {renderItem(item, isDragging)}
                              {isItemDraggable && (
                                <button
                                  type="button"
                                  onPointerDown={(e) => handleDragHandlePointerDown(e, item)}
                                  onPointerMove={handleDragHandlePointerMove}
                                  onPointerUp={handleDragHandlePointerUp}
                                  onPointerCancel={handleDragHandlePointerCancel}
                                  aria-label={`Mover tarjeta ${getItemId(item)}`}
                                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-ink-soft/60 hover:text-ink-soft cursor-grab active:cursor-grabbing transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                                  style={{ touchAction: 'none' }}
                                >
                                  <GripVertical className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </motion.div>
                        </div>
                      );
                    })}
                    <DropIndicator before={END_INDICATOR} column={column.id} />
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {dragState && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            transform: `translate3d(${dragState.pointerX - 56}px, ${dragState.pointerY - 32}px, 0)`,
            transition: 'transform 0.05s linear',
          }}
        >
          <div className="bg-surface border border-border rounded-card shadow-lg px-3 py-2 text-sm font-semibold w-56 opacity-90">
            {draggedItem && renderItem(draggedItem, true)}
          </div>
        </div>
      )}
    </>
  );
}
