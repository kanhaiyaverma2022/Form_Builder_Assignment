import { useState } from 'react';
import { useFormBuilder } from '@/context/FormBuilderContext';
import { nanoid } from 'nanoid';

export default function FieldEditorModal({ field, onClose }) {
  const { dispatch } = useFormBuilder();
  
  // Basic field properties
  const [label, setLabel] = useState(field.label || '');
  const [required, setRequired] = useState(field.required || false);
  const [placeholder, setPlaceholder] = useState(field.placeholder || '');
  
  // Text input specific
  const [inputType, setInputType] = useState(field.inputType || 'text');
  
  // Textarea specific
  const [rows, setRows] = useState(field.rows || 3);
  
  // Options for select, radio, checkbox
  const [options, setOptions] = useState(field.options || []);
  
  // Checkbox specific
  const [checkboxType, setCheckboxType] = useState(field.checkboxType || 'single');

  const textInputTypes = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'number', label: 'Number' },
    { value: 'password', label: 'Password' },
    { value: 'tel', label: 'Phone' },
    { value: 'url', label: 'URL' }
  ];

  const handleSave = () => {
    const updatedField = {
      id: field.id,
      label,
      required,
      placeholder
    };

    // Add type-specific properties
    if (field.type === 'text') {
      updatedField.inputType = inputType;
    }
    
    if (field.type === 'textarea') {
      updatedField.rows = rows;
    }
    
    if (['select', 'radio', 'checkbox'].includes(field.type)) {
      updatedField.options = options;
    }
    
    if (field.type === 'checkbox') {
      updatedField.checkboxType = checkboxType;
    }

    dispatch({
      type: 'UPDATE_FIELD',
      payload: updatedField
    });
    onClose();
  };

  const addOption = () => {
    setOptions([...options, { 
      id: nanoid(), 
      label: `Option ${options.length + 1}`, 
      value: `option${options.length + 1}` 
    }]);
  };

  const updateOption = (optionId, field, value) => {
    setOptions(options.map(opt => 
      opt.id === optionId ? { ...opt, [field]: value } : opt
    ));
  };

  const removeOption = (optionId) => {
    if (options.length > 1) {
      setOptions(options.filter(opt => opt.id !== optionId));
    }
  };

  const renderFieldSpecificInputs = () => {
    switch (field.type) {
      case 'text':
        return (
          <div className="space-y-3">
            <label className="block text-sm">
              Input Type:
              <select
                value={inputType}
                onChange={(e) => setInputType(e.target.value)}
                className="mt-1 w-full border rounded px-2 py-1 text-sm"
              >
                {textInputTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-3">
            <label className="block text-sm">
              Rows:
              <input
                type="number"
                min="2"
                max="10"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value))}
                className="mt-1 w-full border rounded px-2 py-1 text-sm"
              />
            </label>
          </div>
        );

      case 'select':
      case 'radio':
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Options:</label>
              <button
                type="button"
                onClick={addOption}
                className="text-blue-600 text-sm hover:underline"
              >
                + Add Option
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {options.map((option, index) => (
                <div key={option.id} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Label"
                    value={option.label}
                    onChange={(e) => updateOption(option.id, 'label', e.target.value)}
                    className="flex-1 border rounded px-2 py-1 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={option.value}
                    onChange={(e) => updateOption(option.id, 'value', e.target.value)}
                    className="flex-1 border rounded px-2 py-1 text-sm"
                  />
                  {options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(option.id)}
                      className="text-red-500 text-sm hover:underline px-1"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            <label className="block text-sm">
              Checkbox Type:
              <select
                value={checkboxType}
                onChange={(e) => setCheckboxType(e.target.value)}
                className="mt-1 w-full border rounded px-2 py-1 text-sm"
              >
                <option value="single">Single Checkbox</option>
                <option value="multiple">Multiple Checkboxes</option>
              </select>
            </label>
            
            {checkboxType === 'multiple' && (
              <>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Options:</label>
                  <button
                    type="button"
                    onClick={addOption}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    + Add Option
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {options.map((option, index) => (
                    <div key={option.id} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Label"
                        value={option.label}
                        onChange={(e) => updateOption(option.id, 'label', e.target.value)}
                        className="flex-1 border rounded px-2 py-1 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={option.value}
                        onChange={(e) => updateOption(option.id, 'value', e.target.value)}
                        className="flex-1 border rounded px-2 py-1 text-sm"
                      />
                      {options.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeOption(option.id)}
                          className="text-red-500 text-sm hover:underline px-1"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded w-96 shadow-lg max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">Edit {field.type} Field</h3>
        
        <div className="space-y-4">
          {/* Basic Properties */}
          <label className="block text-sm">
            Label:
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="mt-1 w-full border rounded px-2 py-1 text-sm"
              placeholder="Field label"
            />
          </label>

          <label className="block text-sm">
            Placeholder:
            <input
              type="text"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              className="mt-1 w-full border rounded px-2 py-1 text-sm"
              placeholder="Placeholder text"
            />
          </label>

          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              className="mr-2"
            />
            Required Field
          </label>

          {/* Field-Specific Properties */}
          {renderFieldSpecificInputs()}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button 
            onClick={onClose} 
            className="text-gray-600 text-sm px-3 py-1 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
