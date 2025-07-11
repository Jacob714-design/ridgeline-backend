'use client';

import { useState } from 'react';
import { EstimateLineItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Trash2, Info } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface EstimateLineRowProps {
  lineItem: EstimateLineItem;
  onUpdate: (updates: Partial<EstimateLineItem>) => void;
  onDelete: () => void;
}

export function EstimateLineRow({
  lineItem,
  onUpdate,
  onDelete,
}: EstimateLineRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    description: lineItem.description,
    unitPrice: lineItem.unitPrice.toString(),
    quantity: lineItem.quantity.toString(),
  });

  const handleSave = () => {
    onUpdate({
      description: editValues.description,
      unitPrice: parseFloat(editValues.unitPrice),
      quantity: parseFloat(editValues.quantity),
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValues({
      description: lineItem.description,
      unitPrice: lineItem.unitPrice.toString(),
      quantity: lineItem.quantity.toString(),
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="grid grid-cols-12 gap-4 border-b p-4">
        <div className="col-span-5">
          <Input
            value={editValues.description}
            onChange={(e) =>
              setEditValues({ ...editValues, description: e.target.value })
            }
          />
        </div>
        <div className="col-span-2">
          <Input
            type="number"
            step="0.01"
            value={editValues.unitPrice}
            onChange={(e) =>
              setEditValues({ ...editValues, unitPrice: e.target.value })
            }
            className="text-right"
          />
        </div>
        <div className="col-span-2">
          <Input
            type="number"
            step="0.01"
            value={editValues.quantity}
            onChange={(e) =>
              setEditValues({ ...editValues, quantity: e.target.value })
            }
            className="text-right"
          />
        </div>
        <div className="col-span-2 flex items-center justify-end">
          <span className="text-sm font-medium">
            {formatCurrency(
              parseFloat(editValues.unitPrice) * parseFloat(editValues.quantity)
            )}
          </span>
        </div>
        <div className="col-span-1 flex items-center justify-end space-x-2">
          <Button size="sm" variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-12 gap-4 border-b p-4 hover:bg-muted/50"
      onDoubleClick={() => setIsEditing(true)}
    >
      <div className="col-span-5 flex items-center space-x-2">
        <span>{lineItem.description}</span>
        {lineItem.codeRef && (
          <Badge variant="outline" className="text-xs">
            {lineItem.codeRef}
          </Badge>
        )}
        {lineItem.approvalProbability && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Info className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Approval Probability</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{
                        width: `${lineItem.approvalProbability * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(lineItem.approvalProbability * 100)}%
                  </span>
                </div>
                {lineItem.manufacturerRef && (
                  <p className="text-sm text-muted-foreground">
                    Manufacturer: {lineItem.manufacturerRef}
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
      <div className="col-span-2 flex items-center justify-end">
        <span className="text-sm">{formatCurrency(lineItem.unitPrice)}</span>
      </div>
      <div className="col-span-2 flex items-center justify-end">
        <span className="text-sm">{lineItem.quantity}</span>
      </div>
      <div className="col-span-2 flex items-center justify-end">
        <span className="text-sm font-medium">
          {formatCurrency(lineItem.total)}
        </span>
      </div>
      <div className="col-span-1 flex items-center justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}