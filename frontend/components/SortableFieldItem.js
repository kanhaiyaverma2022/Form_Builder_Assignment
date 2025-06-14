import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { useState } from 'react';
import { useFormBuilder } from '@/context/FormBuilderContext';
import FieldEditorModal from './FieldEditorModal';

export default function SortableFieldItem({ field }) {
  const { dispatch } = useFormBuilder();
  const [isEditing, setIsEditing] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: field.id,
    data: {
      type: 'field-item',
      field: field
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = () => {
    dispatch({ type: 'REMOVE_FIELD', payload: field.id });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-3 border rounded bg-gray-100 flex justify-between items-center group hover:shadow-md transition-shadow"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-200 transition-colors"
      >
        <GripVertical className="text-gray-400 w-4 h-4" />
      </div>

      {/* Field Info */}
      <div className="flex-1 ml-3">
        <p className="capitalize font-medium">{field.label}</p>
        <p className="text-xs text-gray-500">{field.type}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-500 hover:underline text-sm px-2 py-1 rounded hover:bg-blue-50"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:underline text-sm px-2 py-1 rounded hover:bg-red-50"
        >
          Delete
        </button>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <FieldEditorModal
          field={field}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}