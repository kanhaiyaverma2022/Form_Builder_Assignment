import { useState } from 'react';
import { useFormBuilder } from '@/context/FormBuilderContext';

export default function FieldEditorModal({ field, onClose }) {
  const { dispatch } = useFormBuilder();
  const [label, setLabel] = useState(field.label);
  const [required, setRequired] = useState(field.required || false);

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        id: field.id,
        label,
        required
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded w-80 shadow">
        <h3 className="text-lg font-bold mb-4">Edit Field</h3>
        <label className="block text-sm mb-2">
          Label:
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="mt-1 w-full border rounded px-2 py-1 text-sm"
          />
        </label>
        <label className="block text-sm mt-3">
          <input
            type="checkbox"
            checked={required}
            onChange={(e) => setRequired(e.target.checked)}
            className="mr-2"
          />
          Required
        </label>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-600 text-sm">Cancel</button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-3 py-1 text-sm rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
