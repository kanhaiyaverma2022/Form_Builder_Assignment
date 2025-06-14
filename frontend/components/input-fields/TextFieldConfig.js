import { useState } from 'react';

const textInputTypes = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
  { value: 'password', label: 'Password' },
  { value: 'tel', label: 'Phone' },
  { value: 'url', label: 'URL' }
];

export default function TextFieldConfig({ field, onChange }) {
  const [inputType, setInputType] = useState(field.inputType || 'text');

  const handleInputTypeChange = (newInputType) => {
    setInputType(newInputType);
    onChange({ inputType: newInputType });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm">
        <span className="font-medium text-purple-800 mb-2 block">Input Type:</span>
        <select
          value={inputType}
          onChange={(e) => handleInputTypeChange(e.target.value)}
          className="w-full border border-purple-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
}