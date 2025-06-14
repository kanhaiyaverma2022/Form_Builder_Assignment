import { useState } from 'react';
import { useFormBuilder } from '@/context/FormBuilderContext';
import FieldEditorModal from './FieldEditorModal';

export default function FieldItem({ field }) {
  const { dispatch } = useFormBuilder();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    dispatch({ type: 'REMOVE_FIELD', payload: field.id });
  };

  return (
    <div className="p-3 border rounded bg-gray-100 flex justify-between items-center">
      <div>
        <p className="capitalize font-medium">{field.label}</p>
        <p className="text-xs text-gray-500">{field.type}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-500 hover:underline text-sm"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:underline text-sm"
        >
          Delete
        </button>
      </div>

      {isEditing && (
        <FieldEditorModal
          field={field}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}

