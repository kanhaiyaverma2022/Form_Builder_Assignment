import { useState } from 'react';
import { useFormBuilder } from '@/context/FormBuilderContext';
import BasicFieldConfig from './input-fields/BasicFieldConfig';
import TextFieldConfig from './input-fields/TextFieldConfig';
import TextareaFieldConfig from './input-fields/TextareaFieldConfig';
import OptionsFieldConfig from './input-fields/OptionsFieldConfig';
import CheckboxFieldConfig from './input-fields/CheckboxFieldConfig';

export default function FieldEditorModal({ field, onClose }) {
  const { dispatch } = useFormBuilder();
  const [fieldData, setFieldData] = useState({
    id: field.id,
    type: field.type,
    label: field.label || '',
    required: field.required || false,
    placeholder: field.placeholder || '',
    inputType: field.inputType || 'text',
    rows: field.rows || 3,
    options: field.options || [],
    checkboxType: field.checkboxType || 'single'
  });

  const [errors, setErrors] = useState({});

  const handleFieldChange = (updates) => {
    setFieldData(prev => ({ ...prev, ...updates }));
    
    // Clear errors when user makes changes
    if (errors.label && updates.label) {
      setErrors(prev => ({ ...prev, label: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!fieldData.label || fieldData.label.trim() === '') {
      newErrors.label = 'Field label is required';
    }
    
    if (['select', 'radio'].includes(field.type) && fieldData.options.length === 0) {
      newErrors.options = `${field.type} fields must have at least one option`;
    }
    
    if (field.type === 'checkbox' && fieldData.checkboxType === 'multiple' && fieldData.options.length === 0) {
      newErrors.options = 'Multiple checkboxes must have at least one option';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    // Create updated field object with only relevant properties
    const updatedField = {
      id: fieldData.id,
      label: fieldData.label.trim(),
      required: fieldData.required,
      placeholder: fieldData.placeholder
    };

    // Add type-specific properties
    if (field.type === 'text') {
      updatedField.inputType = fieldData.inputType;
    }
    
    if (field.type === 'textarea') {
      updatedField.rows = fieldData.rows;
    }
    
    if (['select', 'radio', 'checkbox'].includes(field.type)) {
      updatedField.options = fieldData.options;
    }
    
    if (field.type === 'checkbox') {
      updatedField.checkboxType = fieldData.checkboxType;
    }

    dispatch({
      type: 'UPDATE_FIELD',
      payload: updatedField
    });
    onClose();
  };

  const getFieldIcon = () => {
    const iconClass = "w-6 h-6 text-purple-600";
    switch (field.type) {
      case 'text':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        );
      case 'textarea':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        );
      case 'select':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        );
      case 'radio':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'checkbox':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
        );
    }
  };

  const renderFieldSpecificConfig = () => {
    switch (field.type) {
      case 'text':
        return (
          <TextFieldConfig 
            field={fieldData} 
            onChange={handleFieldChange} 
          />
        );
      
      case 'textarea':
        return (
          <TextareaFieldConfig 
            field={fieldData} 
            onChange={handleFieldChange} 
          />
        );
      
      case 'select':
      case 'radio':
        return (
          <OptionsFieldConfig 
            field={fieldData} 
            onChange={handleFieldChange}
            fieldType={field.type}
          />
        );
      
      case 'checkbox':
        return (
          <CheckboxFieldConfig 
            field={fieldData} 
            onChange={handleFieldChange} 
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl max-h-[95vh] overflow-hidden border border-purple-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFieldIcon()}
              <div>
                <h3 className="text-xl font-bold">Edit {field.type} Field</h3>
                <p className="text-purple-100 text-sm mt-1">
                  Configure your {field.type} field settings below
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-purple-200 hover:text-white p-2 rounded-full hover:bg-purple-500/20 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-180px)]">
          <div className="space-y-6">
            {/* Basic Configuration */}
            <div>
              <h4 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Basic Settings
              </h4>
              <BasicFieldConfig 
                field={fieldData} 
                onChange={handleFieldChange} 
              />
              {errors.label && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.label}
                </p>
              )}
            </div>

            {/* Field-Specific Configuration */}
            {renderFieldSpecificConfig() && (
              <div>
                <h4 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                  {field.type.charAt(0).toUpperCase() + field.type.slice(1)} Settings
                </h4>
                {renderFieldSpecificConfig()}
                {errors.options && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.options}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Changes will be applied to your form immediately
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose} 
              className="text-purple-600 text-sm px-5 py-2 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 text-sm rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}