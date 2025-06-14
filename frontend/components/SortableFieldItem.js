// components/SortableFieldItem.js
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react'; // or any icon
import React from 'react';

export default function SortableFieldItem({ field }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="p-3 border rounded bg-gray-100 flex items-center justify-between"
    >
      <div>
        <p className="font-medium">{field.label}</p>
        <p className="text-sm text-gray-500">Type: {field.type}</p>
      </div>
      <GripVertical className="text-gray-400 cursor-grab" />
    </div>
  );
}
