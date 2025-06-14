import { useState } from 'react';

export default function BasicFieldConfig({ field, onChange }) {
  const [label, setLabel] = useState(field.label || '');
  const [required, setRequired] = useState(field.required || false);
  const [placeholder, setPlaceholder] = useState(field.placeholder || '');

  const handleLabelChange = (newLabel) => {
    setLabel(newLabel);
    onChange({ label: newLabel });
  };

  const handleRequiredChange = (isRequired) => {
    setRequired(isRequired);
    onChange({ required: isRequired });
  };

  const handlePlaceholderChange = (newPlaceholder) => {
    setPlaceholder(newPlaceholder);
    onChange({ placeholder: newPlaceholder });
  };

  const getPlaceholderHelp = () => {
    switch (field.type) {
      case 'text':
      case 'textarea':
        return 'Text that appears inside the input when empty';
      case 'select':
        return 'Text shown as the default option (e.g., "Choose an option...")';
      case 'checkbox':
        return field.checkboxType === 'single' 
          ? 'Text that appears next to the checkbox'
          : 'Not used for multiple checkboxes';
      case 'radio':
        return 'Not used for radio buttons (use option labels instead)';
      default:
        return 'Placeholder text for this field';
    }
  };

  const shouldShowPlaceholder = () => {
    // Don't show placeholder for radio buttons or multiple checkboxes
    return !(field.type === 'radio' || (field.type === 'checkbox' && field.checkboxType === 'multiple'));
  };

  return (
    <div className="space-y-5">
      {/* Label Field */}
      <label className="block text-sm">
        <span className="font-medium text-purple-800 mb-2 block">
          Field Label: <span className="text-red-500">*</span>
        </span>
        <input
          type="text"
          value={label}
          onChange={(e) => handleLabelChange(e.target.value)}
          className="w-full border border-purple-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          placeholder="Enter field label"
          required
        />
        <p className="text-xs text-purple-600 mt-1">
          This label will be displayed above the field
        </p>
      </label>

      {/* Placeholder Field */}
      {shouldShowPlaceholder() && (
        <label className="block text-sm">
          <span className="font-medium text-purple-800 mb-2 block">Placeholder Text:</span>
          <input
            type="text"
            value={placeholder}
            onChange={(e) => handlePlaceholderChange(e.target.value)}
            className="w-full border border-purple-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Enter placeholder text"
          />
          <p className="text-xs text-purple-600 mt-1">
            {getPlaceholderHelp()}
          </p>
        </label>
      )}

      {/* Required Field Checkbox */}
      <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
        <input
          type="checkbox"
          id="required-field"
          checked={required}
          onChange={(e) => handleRequiredChange(e.target.checked)}
          className="w-4 h-4 text-purple-600 bg-purple-50 border-purple-300 rounded focus:ring-purple-500 focus:ring-2 mt-0.5"
        />
        <div className="flex-1">
          <label htmlFor="required-field" className="font-medium text-purple-800 cursor-pointer">
            Required Field
          </label>
          <p className="text-xs text-purple-600 mt-1">
            {required 
              ? 'Users must fill this field before submitting the form' 
              : 'This field is optional for users'
            }
          </p>
        </div>
      </div>

      {/* Field Preview */}
      <div className="border-t border-purple-200 pt-4">
        <h4 className="text-sm font-medium text-purple-800 mb-3">Label Preview:</h4>
        <div className="bg-gray-50 p-3 rounded-lg border">
          <label className="block font-medium text-gray-700">
            {label || 'Field Label'}
            {required && <span className="text-purple-600 ml-1">*</span>}
          </label>
        </div>
      </div>
    </div>
  );
}