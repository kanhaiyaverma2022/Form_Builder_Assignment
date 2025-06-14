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
      className={`min-h-[400px] md:min-h-[500px] border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
        isOver 
          ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg' 
          : 'border-purple-300 bg-gradient-to-br from-white to-purple-50 hover:border-purple-400'
      }`}
    >
      {state.fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-purple-800 mb-2">Build Your Form</h3>
          <p className="text-purple-600 max-w-md">
            Drag field types from the palette on the left to create your form. 
            You can reorder and customize each field after adding it.
          </p>
        </div>
      ) : (
        <SortableContext items={state.fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-4">
            {state.fields.map((field) => (
              <SortableFieldItem key={field.id} field={field} />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
}