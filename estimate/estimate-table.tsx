'use client';

import { useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { EstimateLineItem } from '@/types';
import { EstimateLineRow } from './estimate-line-row';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EstimateTableProps {
  lineItems: EstimateLineItem[];
  onUpdateLine: (id: string, updates: Partial<EstimateLineItem>) => void;
  onAddLine: () => void;
  onDeleteLine: (id: string) => void;
}

export function EstimateTable({
  lineItems,
  onUpdateLine,
  onAddLine,
  onDeleteLine,
}: EstimateTableProps) {
  const total = lineItems.reduce((sum, item) => sum + item.total, 0);

  const Header = () => (
    <div className="sticky top-0 z-10 grid grid-cols-12 gap-4 border-b bg-background p-4 text-sm font-medium">
      <div className="col-span-5">Description</div>
      <div className="col-span-2 text-right">Unit Price</div>
      <div className="col-span-2 text-right">Quantity</div>
      <div className="col-span-2 text-right">Total</div>
      <div className="col-span-1"></div>
    </div>
  );

  const Footer = () => (
    <div className="sticky bottom-0 z-10 border-t bg-background p-4">
      <div className="flex items-center justify-between">
        <Button onClick={onAddLine} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Line Item
        </Button>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Total</div>
          <div className="text-2xl font-bold">{formatCurrency(total)}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col rounded-lg border">
      <Header />
      <div className="flex-1">
        <Virtuoso
          data={lineItems}
          itemContent={(index, item) => (
            <EstimateLineRow
              key={item.id}
              lineItem={item}
              onUpdate={(updates) => onUpdateLine(item.id, updates)}
              onDelete={() => onDeleteLine(item.id)}
            />
          )}
        />
      </div>
      <Footer />
    </div>
  );
}