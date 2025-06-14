import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Mail, Hash, Type, List, CheckSquare, Circle } from 'lucide-react';
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

  const getFieldIcon = () => {
    switch (field.type) {
      case 'text':
        if (field.inputType === 'email') return <Mail className="w-4 h-4 text-purple-600" />;
        if (field.inputType === 'number') return <Hash className="w-4 h-4 text-purple-600" />;
        return <Type className="w-4 h-4 text-purple-600" />;
      case 'textarea':
        return <List className="w-4 h-4 text-purple-600" />;
      case 'select':
        return <List className="w-4 h-4 text-purple-600" />;
      case 'checkbox':
        return <CheckSquare className="w-4 h-4 text-purple-600" />;
      case 'radio':
        return <Circle className="w-4 h-4 text-purple-600" />;
      default:
        return <Type className="w-4 h-4 text-purple-600" />;
    }
  };

  const getFieldSubtitle = () => {
    const parts = [];
    
    // Add type info
    if (field.type === 'text' && field.inputType && field.inputType !== 'text') {
      parts.push(field.inputType);
    } else {
      parts.push(field.type);
    }
    
    // Add required indicator
    if (field.required) {
      parts.push('required');
    }
    
    // Add options count for select/radio/checkbox
    if (field.options && field.options.length > 0) {
      parts.push(`${field.options.length} options`);
    }
    
    return parts.join(' • ');
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 border rounded-lg bg-gradient-to-r from-white to-purple-50 shadow-sm hover:shadow-md transition-all duration-200 group border-purple-200 hover:border-purple-300"
    >
      <div className="flex items-center justify-between">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 rounded hover:bg-purple-100 transition-colors -ml-2 touch-manipulation"
        >
          <GripVertical className="text-purple-400 w-5 h-5" />
        </div>

        {/* Field Info */}
        <div className="flex-1 ml-3">
          <div className="flex items-center space-x-2 mb-1">
            {getFieldIcon()}
            <h3 className="font-semibold text-purple-900">{field.label}</h3>
            {field.required && (
              <span className="text-purple-600 text-sm font-medium">*</span>
            )}
          </div>
          
          <p className="text-xs text-purple-600">{getFieldSubtitle()}</p>
          
          {/* Show placeholder if exists */}
          {field.placeholder && (
            <p className="text-xs text-purple-500 mt-1 italic">
              "{field.placeholder}"
            </p>
          )}
          
          {/* Show options preview for select/radio */}
          {field.options && field.options.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-1">
                {field.options.slice(0, 3).map((option, index) => (
                  <span 
                    key={option.id} 
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                  >
                    {option.label}
                  </span>
                ))}
                {field.options.length > 3 && (
                  <span className="text-xs text-purple-500">
                    +{field.options.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="text-purple-600 hover:bg-purple-50 text-sm px-3 py-2 rounded transition-colors font-medium touch-manipulation"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:bg-red-50 text-sm px-3 py-2 rounded transition-colors font-medium touch-manipulation"
          >
            Delete
          </button>
        </div>
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