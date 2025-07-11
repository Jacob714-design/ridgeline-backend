'use client';

import { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  id: string;
  title: string;
  count: number;
  children: ReactNode;
}

export function KanbanColumn({ id, title, count, children }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex h-full min-w-[350px] flex-col rounded-lg border bg-muted/50 transition-colors',
        isOver && 'border-primary bg-muted'
      )}
    >
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="font-semibold">{title}</h3>
        <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
          {count}
        </span>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {children}
      </div>
    </div>
  );
}