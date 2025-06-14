import { useState } from 'react';
import OptionsFieldConfig from './OptionsFieldConfig';

export default function CheckboxFieldConfig({ field, onChange }) {
  const [checkboxType, setCheckboxType] = useState(field.checkboxType || 'single');
  const [options, setOptions] = useState(field.options || []);

  const handleCheckboxTypeChange = (newType) => {
    setCheckboxType(newType);
    onChange({ checkboxType: newType });
  };

  const handleOptionsChange = (optionsData) => {
    setOptions(optionsData.options);
    onChange({ options: optionsData.options });
  };

  return (
    <div className="space-y-5">
      {/* Checkbox Type Selection */}
      <div className="space-y-3">
        <label className="block text-sm">
          <span className="font-medium text-purple-800 mb-2 block">Checkbox Type:</span>
          <select
            value={checkboxType}
            onChange={(e) => handleCheckboxTypeChange(e.target.value)}
            className="w-full border border-purple-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="single">Single Checkbox</option>
            <option value="multiple">Multiple Checkboxes (Group)</option>
          </select>
        </label>

        {/* Type Explanation */}
        <div className="text-xs text-purple-600 bg-purple-50 p-3 rounded-lg border border-purple-200">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              {checkboxType === 'single' ? (
                <div>
                  <p className="font-medium text-purple-700">Single Checkbox</p>
                  <p className="mt-1">A simple yes/no checkbox. The placeholder text will be used as the label.</p>
                </div>
              ) : (
                <div>
                  <p className="font-medium text-purple-700">Multiple Checkboxes</p>
                  <p className="mt-1">A group of checkboxes where users can select multiple options. Configure the options below.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Options Configuration for Multiple Checkboxes */}
      {checkboxType === 'multiple' && (
        <div className="border-t border-purple-200 pt-4">
          <OptionsFieldConfig 
            field={{ ...field, options }}
            onChange={handleOptionsChange}
            fieldType="checkbox"
          />
        </div>
      )}

      {/* Preview Section */}
      <div className="border-t border-purple-200 pt-4">
        <h4 className="text-sm font-medium text-purple-800 mb-3">Preview:</h4>
        <div className="bg-gray-50 p-4 rounded-lg border">
          {checkboxType === 'single' ? (
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                disabled 
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" 
              />
              <span className="text-gray-700">
                {field.placeholder || 'Check this box'}
              </span>
            </label>
          ) : (
            <div className="space-y-2">
              {options.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No options configured yet</p>
              ) : (
                options.map((option, index) => (
                  <label key={index} className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      disabled 
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" 
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}