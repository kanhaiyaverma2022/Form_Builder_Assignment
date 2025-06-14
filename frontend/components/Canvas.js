import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useFormBuilder } from '@/context/FormBuilderContext';
import SortableFieldItem from './SortableFieldItem';

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
        <SortableContext items={state.fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3">
            {state.fields.map((field) => (
              <SortableFieldItem key={field.id} field={field} />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
}