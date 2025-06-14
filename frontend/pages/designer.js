import { useState } from 'react';
import { useRouter } from 'next/router';
import { DndContext } from '@dnd-kit/core';
import { useFormBuilder } from '@/context/FormBuilderContext';
import FieldPalette from '@/components/FieldPalette';
import Canvas from '@/components/Canvas';
import { nanoid } from 'nanoid';

export default function DesignerPage() {
  const { state, dispatch } = useFormBuilder();
  const router = useRouter();

  const handleDragEnd = (event) => {
    const { over, active } = event;
    if (over?.id === 'canvas') {
      const type = active?.data?.current?.type;
      if (type) {
        dispatch({ type: 'ADD_FIELD', payload: type });
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
    <DndContext onDragEnd={handleDragEnd}>
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
    </DndContext>
  );
}
