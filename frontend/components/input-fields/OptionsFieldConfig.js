import { useState } from 'react';
import { nanoid } from 'nanoid';

export default function OptionsFieldConfig({ field, onChange, fieldType }) {
  const [options, setOptions] = useState(field.options || []);

  const addOption = () => {
    const newOption = { 
      id: nanoid(), 
      label: `Option ${options.length + 1}`, 
      value: `option${options.length + 1}` 
    };
    const updatedOptions = [...options, newOption];
    setOptions(updatedOptions);
    onChange({ options: updatedOptions });
  };

  const updateOption = (optionId, fieldName, value) => {
    const updatedOptions = options.map(opt => 
      opt.id === optionId ? { ...opt, [fieldName]: value } : opt
    );
    setOptions(updatedOptions);
    onChange({ options: updatedOptions });
  };

  const removeOption = (optionId) => {
    if (options.length > 1) {
      const updatedOptions = options.filter(opt => opt.id !== optionId);
      setOptions(updatedOptions);
      onChange({ options: updatedOptions });
    }
  };

  const duplicateOption = (optionId) => {
    const optionToDuplicate = options.find(opt => opt.id === optionId);
    if (optionToDuplicate) {
      const newOption = {
        id: nanoid(),
        label: `${optionToDuplicate.label} (Copy)`,
        value: `${optionToDuplicate.value}_copy`
      };
      const updatedOptions = [...options, newOption];
      setOptions(updatedOptions);
      onChange({ options: updatedOptions });
    }
  };

  const getFieldTypeLabel = () => {
    switch (fieldType) {
      case 'select': return 'dropdown';
      case 'radio': return 'radio button';
      case 'checkbox': return 'checkbox';
      default: return 'option';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-purple-800">
          Options for {getFieldTypeLabel()}:
        </label>
        <button
          type="button"
          onClick={addOption}
          className="text-purple-600 text-sm hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-lg transition-colors font-medium flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Option
        </button>
      </div>

      {options.length === 0 ? (
        <div className="text-center py-8 bg-purple-50 rounded-lg border-2 border-dashed border-purple-200">
          <svg className="w-8 h-8 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-purple-600 text-sm">No options yet</p>
          <p className="text-purple-500 text-xs mt-1">Click "Add Option" to create your first option</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {options.map((option, index) => (
            <div key={option.id} className="flex gap-2 items-center p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex-shrink-0 w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-purple-700">{index + 1}</span>
              </div>
              
              <input
                type="text"
                placeholder="Display Label"
                value={option.label}
                onChange={(e) => updateOption(option.id, 'label', e.target.value)}
                className="flex-1 border border-purple-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              
              <input
                type="text"
                placeholder="Form Value"
                value={option.value}
                onChange={(e) => updateOption(option.id, 'value', e.target.value)}
                className="flex-1 border border-purple-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => duplicateOption(option.id)}
                  className="text-purple-500 hover:text-purple-700 hover:bg-purple-100 p-1.5 rounded-lg transition-colors"
                  title="Duplicate option"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                
                {options.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOption(option.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                    title="Remove option"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {options.length > 0 && (
        <div className="text-xs text-purple-600 bg-purple-50 p-3 rounded-lg border border-purple-200">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium text-purple-700">Options Preview:</p>
              <p className="mt-1">
                <strong>Display Label:</strong> What users see • <strong>Form Value:</strong> What gets submitted
              </p>
              <p className="mt-1">You have {options.length} option{options.length !== 1 ? 's' : ''} configured</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}