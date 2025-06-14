import { useDraggable } from '@dnd-kit/core';
import { Type, Hash, Mail, FileText, List, CheckSquare, Circle } from 'lucide-react';

const fieldTypes = [
  { 
    type: 'text', 
    label: 'Text Input', 
    description: 'Single line text, email, number',
    icon: Type,
    color: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
  },
  { 
    type: 'textarea', 
    label: 'Textarea', 
    description: 'Multi-line text input',
    icon: FileText,
    color: 'bg-purple-50 hover:bg-purple-100 border-purple-200'
  },
  { 
    type: 'select', 
    label: 'Select Dropdown', 
    description: 'Choose from options',
    icon: List,
    color: 'bg-orange-50 hover:bg-orange-100 border-orange-200'
  },
  { 
    type: 'checkbox', 
    label: 'Checkbox', 
    description: 'Single or multiple checkboxes',
    icon: CheckSquare,
    color: 'bg-green-50 hover:bg-green-100 border-green-200'
  },
  { 
    type: 'radio', 
    label: 'Radio Buttons', 
    description: 'Select one from options',
    icon: Circle,
    color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200'
  },
];

export default function FieldPalette() {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Drag fields to canvas</h3>
        <p className="text-xs text-gray-500">Click and drag any field type below to add it to your form</p>
      </div>
      
      {fieldTypes.map((field, index) => (
        <DraggableField key={index} field={field} />
      ))}
    </div>
  );
}

function DraggableField({ field }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `field-${field.type}`,
    data: { type: field.type },
  });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  const IconComponent = field.icon;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`cursor-move p-3 rounded-lg border transition-all duration-200 ${field.color} hover:shadow-sm`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          <IconComponent className="w-4 h-4 text-gray-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900">{field.label}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{field.description}</p>
        </div>
      </div>
    </div>
  );
}