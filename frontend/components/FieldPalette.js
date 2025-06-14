import { useDraggable } from '@dnd-kit/core';

const fieldTypes = [
  { type: 'text', label: 'Text' },
  { type: 'textarea', label: 'Textarea' },
  { type: 'select', label: 'Select' },
  { type: 'checkbox', label: 'Checkbox' },
  { type: 'radio', label: 'Radio' },
];

export default function FieldPalette() {
  return (
    <div className="flex flex-col gap-2">
      {fieldTypes.map((field, index) => (
        <DraggableField key={index} field={field} />
      ))}
    </div>
  );
}

function DraggableField({ field }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `field-${field.type}`,
    data: { type: field.type },
  });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="cursor-move px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded text-sm"
    >
      {field.label}
    </div>
  );
}
