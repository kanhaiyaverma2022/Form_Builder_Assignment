import { useDraggable } from '@dnd-kit/core';
import { Type, Hash, Mail, FileText, List, CheckSquare, Circle } from 'lucide-react';

const fieldTypes = [
  { 
    type: 'text', 
    label: 'Text Input', 
    description: 'Single line text, email, number',
    icon: Type,
    color: 'bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-150 border-purple-200',
    iconColor: 'text-purple-600'
  },
  { 
    type: 'textarea', 
    label: 'Textarea', 
    description: 'Multi-line text input',
    icon: FileText,
    color: 'bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-150 border-purple-200',
    iconColor: 'text-purple-600'
  },
  { 
    type: 'select', 
    label: 'Select Dropdown', 
    description: 'Choose from options',
    icon: List,
    color: 'bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-150 border-purple-200',
    iconColor: 'text-purple-600'
  },
  { 
    type: 'checkbox', 
    label: 'Checkbox', 
    description: 'Single or multiple checkboxes',
    icon: CheckSquare,
    color: 'bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-150 border-purple-200',
    iconColor: 'text-purple-600'
  },
  { 
    type: 'radio', 
    label: 'Radio Buttons', 
    description: 'Select one from options',
    icon: Circle,
    color: 'bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-150 border-purple-200',
    iconColor: 'text-purple-600'
  },
];

export default function FieldPalette() {
  return (
    <div className="space-y-3">
      <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
        <h3 className="text-sm font-semibold text-purple-800 mb-2">Drag fields to canvas</h3>
        <p className="text-xs text-purple-600">Click and drag any field type below to add it to your form</p>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {fieldTypes.map((field, index) => (
          <DraggableField key={index} field={field} />
        ))}
      </div>
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
      className={`cursor-move p-4 rounded-lg border transition-all duration-200 touch-manipulation select-none ${field.color} hover:shadow-md active:scale-95`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          <IconComponent className={`w-5 h-5 ${field.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-purple-800">{field.label}</h4>
          <p className="text-xs text-purple-600 mt-0.5 leading-relaxed">{field.description}</p>
        </div>
      </div>
    </div>
  );
}