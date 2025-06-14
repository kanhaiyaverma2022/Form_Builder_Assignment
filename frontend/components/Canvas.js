import { useDroppable } from '@dnd-kit/core';
import { useFormBuilder } from '@/context/FormBuilderContext';
import FieldItem from './FieldItem';

export default function Canvas() {
  const { isOver, setNodeRef } = useDroppable({ id: 'canvas' });
  const { state } = useFormBuilder();

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[300px] border-2 border-dashed rounded p-4 ${
        isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
    >
      {state.fields.length === 0 ? (
        <p className="text-gray-400">Drag fields here</p>
      ) : (
        <div className="flex flex-col gap-3">
         {state.fields.map((field) => (
  <FieldItem key={field.id} field={field} />
))}

        </div>
      )}
    </div>
  );
}

