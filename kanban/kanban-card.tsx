'use client';

import Link from 'next/link';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, DollarSign, MapPin } from 'lucide-react';
import { Claim } from '@/types';
import { cn, formatCurrency, formatDate, getInitials } from '@/lib/utils';

interface KanbanCardProps {
  claim: Claim;
  isDragging?: boolean;
}

export function KanbanCard({ claim, isDragging }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: claim.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'cursor-grab touch-none',
        isDragging && 'cursor-grabbing'
      )}
    >
      <Link href={`/app/claims/${claim.id}`}>
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base">{claim.claimNumber}</CardTitle>
              <Badge variant="outline" className="text-xs">
                {claim.insuranceCompany}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Client info */}
            <div className="flex items-center space-x-2 text-sm">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {getInitials(claim.client?.name || '')}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{claim.client?.name}</span>
            </div>

            {/* Location */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{claim.client?.address}</span>
            </div>

            {/* Projects count */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {claim.projects?.length || 0} projects
              </span>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(claim.createdAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}