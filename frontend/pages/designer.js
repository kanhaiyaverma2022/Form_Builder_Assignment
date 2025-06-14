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

  const handleClearForm = () => {
    if (confirm('Are you sure you want to clear all fields? This action cannot be undone.')) {
      dispatch({ type: 'CLEAR_FORM' });
    }
  };

  return (
    <DndContext 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                  Form Builder
                </h1>
                <p className="text-purple-600 text-sm mt-1">
                  Create beautiful forms with drag and drop
                </p>
              </div>
              <div className="flex gap-3">
                {state.fields.length > 0 && (
                  <button
                    onClick={handleClearForm}
                    className="px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors font-medium"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={handlePreview}
                  disabled={state.fields.length === 0}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                >
                  Preview Form
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Field Palette - Full width on mobile, sidebar on desktop */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
                <h2 className="text-lg font-bold text-purple-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Field Types
                </h2>
                <FieldPalette />
              </div>
            </div>

            {/* Canvas Area - Full width on mobile, main area on desktop */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-purple-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Form Canvas
                  </h2>
                  {state.fields.length > 0 && (
                    <div className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                      {state.fields.length} field{state.fields.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                <Canvas />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drag Overlay for visual feedback */}
      <DragOverlay>
        {activeId ? (
          <div className="p-4 border rounded-lg bg-white shadow-2xl opacity-90 border-purple-300">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p className="font-medium text-purple-800">Dragging field...</p>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}