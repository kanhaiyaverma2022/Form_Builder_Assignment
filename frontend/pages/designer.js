import { useState } from 'react';
import { useRouter } from 'next/router';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useFormBuilder } from '@/context/FormBuilderContext';
import FieldPalette from '@/components/FieldPalette';
import Canvas from '@/components/Canvas';
import { nanoid } from 'nanoid';

export default function DesignerPage() {
  const { state, dispatch } = useFormBuilder();
  const router = useRouter();
  const [activeId, setActiveId] = useState(null);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { over, active } = event;
    setActiveId(null);

    if (!over) return;

    // Check if it's a new field being dropped from palette to canvas
    if (over.id === 'canvas' && active.data.current?.type && !active.data.current?.field) {
      const type = active.data.current.type;
      dispatch({ type: 'ADD_FIELD', payload: type });
      return;
    }

    // Check if it's reordering existing fields within canvas
    if (active.data.current?.type === 'field-item' && over.data.current?.type === 'field-item') {
      if (active.id !== over.id) {
        dispatch({
          type: 'REORDER_FIELDS',
          payload: {
            activeId: active.id,
            overId: over.id
          }
        });
      }
    }
  };

  const handlePreview = () => {
    const formId = nanoid();

    dispatch({
      type: 'SAVE_FORM',
      payload: {
        id: formId,
        fields: state.fields
      }
    });

    router.push(`/forms/${formId}`);
  };

  return (
    <DndContext 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <div className="min-h-screen p-6 bg-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Form Builder</h1>
          <button
            onClick={handlePreview}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Preview Form
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Field Types</h2>
            <FieldPalette />
          </div>

          <div className="col-span-3 bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Canvas</h2>
            <Canvas />
          </div>
        </div>
      </div>

      {/* Drag Overlay for visual feedback */}
      <DragOverlay>
        {activeId ? (
          <div className="p-3 border rounded bg-gray-100 shadow-lg opacity-80">
            <p className="font-medium">Dragging...</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}