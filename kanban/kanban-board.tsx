'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { KanbanColumn } from './kanban-column';
import { KanbanCard } from './kanban-card';
import { ClaimStatus, Claim } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

const columns: { id: ClaimStatus; title: string }[] = [
  { id: 'NEW', title: 'New Claims' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'UNDER_REVIEW', title: 'Under Review' },
  { id: 'APPROVED', title: 'Approved' },
  { id: 'DENIED', title: 'Denied' },
];

interface KanbanBoardProps {
  claims: Claim[];
}

export function KanbanBoard({ claims: initialClaims }: KanbanBoardProps) {
  const [claims, setClaims] = useState(initialClaims);
  const [activeId, setActiveId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const updateClaimStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ClaimStatus }) =>
      apiClient.put(`/claims/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeClaimId = active.id as string;
    const overStatus = over.id as ClaimStatus;

    const activeClaim = claims.find(claim => claim.id === activeClaimId);
    if (!activeClaim || activeClaim.status === overStatus) return;

    // Update local state immediately for optimistic UI
    setClaims(prevClaims =>
      prevClaims.map(claim =>
        claim.id === activeClaimId
          ? { ...claim, status: overStatus }
          : claim
      )
    );

    // Update on server
    updateClaimStatus.mutate({ id: activeClaimId, status: overStatus });

    setActiveId(null);
  };

  const activeClaim = activeId
    ? claims.find(claim => claim.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full space-x-4 overflow-x-auto">
        {columns.map(column => {
          const columnClaims = claims.filter(
            claim => claim.status === column.id
          );

          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              count={columnClaims.length}
            >
              <SortableContext
                items={columnClaims.map(c => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {columnClaims.map(claim => (
                  <KanbanCard key={claim.id} claim={claim} />
                ))}
              </SortableContext>
            </KanbanColumn>
          );
        })}
      </div>
      <DragOverlay>
        {activeClaim ? <KanbanCard claim={activeClaim} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}