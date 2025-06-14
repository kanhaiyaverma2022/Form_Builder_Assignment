import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function FormPreview({ fields }) {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e, fieldId, fieldType = 'default') => {
    let value;
    
    if (fieldType === 'checkbox') {
      // For multiple checkboxes, handle array of values
      const currentValues = Array.isArray(formData[fieldId]) ? formData[fieldId] : [];
      
      if (e.target.checked) {
        value = [...currentValues, e.target.value];
      } else {
        value = currentValues.filter(v => v !== e.target.value);
      }
    } else if (fieldType === 'single-checkbox') {
      // For single checkbox, handle boolean value
      value = e.target.checked;
    } else {
      value = e.target.value;
    }

    setFormData({ ...formData, [fieldId]: value });
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors({ ...errors, [fieldId]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    fields.forEach(field => {
      const value = formData[field.id];
      
      // Check required fields
      if (field.required) {
        if (!value || 
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === 'string' && value.trim() === '')) {
          newErrors[field.id] = `${field.label} is required`;
          return;
        }
      }
      
      // Validate email
      if (field.inputType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.id] = 'Please enter a valid email address';
        }
      }
      
      // Validate number
      if (field.inputType === 'number' && value) {
        if (isNaN(value)) {
          newErrors[field.id] = 'Please enter a valid number';
        }
      }
      
      // Validate URL
      if (field.inputType === 'url' && value) {
        try {
          new URL(value);
        } catch {
          newErrors[field.id] = 'Please enter a valid URL';
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) {
      setMessage('❌ Please fix the errors above');
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/forms/${id}`, {
        formData,
        fields
      });

      if (res.status === 200) {
        setMessage('✅ Form submitted successfully!');
        setFormData({});
      } else {
        setMessage('❌ Submission failed. Try again.');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Something went wrong.');
    }
  };

  const renderField = (field) => {
    const hasError = errors[field.id];
    const errorClass = hasError 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-purple-200 focus:border-purple-500 focus:ring-purple-500';
    
    switch (field.type) {
      case 'text':
        return (
          <div>
            <input
              type={field.inputType || 'text'}
              placeholder={field.placeholder}
              required={field.required}
              className={`border-2 p-3 w-full rounded-lg transition-all focus:outline-none focus:ring-2 ${errorClass}`}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(e, field.id)}
            />
            {hasError && <p className="text-red-500 text-sm mt-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors[field.id]}
            </p>}
          </div>
        );
        
      case 'textarea':
        return (
          <div>
            <textarea
              placeholder={field.placeholder}
              required={field.required}
              rows={field.rows || 3}
              className={`border-2 p-3 w-full rounded-lg transition-all resize-vertical focus:outline-none focus:ring-2 ${errorClass}`}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(e, field.id)}
            />
            {hasError && <p className="text-red-500 text-sm mt-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors[field.id]}
            </p>}
          </div>
        );
        
      case 'select':
        return (
          <div>
            <select
              required={field.required}
              className={`border-2 p-3 w-full rounded-lg transition-all focus:outline-none focus:ring-2 ${errorClass}`}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(e, field.id)}
            >
              <option value="">{field.placeholder || 'Select an option'}</option>
              {field.options?.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {hasError && <p className="text-red-500 text-sm mt-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors[field.id]}
            </p>}
          </div>
        );
        
      case 'radio':
        return (
          <div>
            <div className="space-y-3">
              {field.options?.map((option) => (
                <label key={option.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name={field.id}
                    value={option.value}
                    checked={formData[field.id] === option.value}
                    onChange={(e) => handleChange(e, field.id)}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
            {hasError && <p className="text-red-500 text-sm mt-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors[field.id]}
            </p>}
          </div>
        );
        
      case 'checkbox':
        if (field.checkboxType === 'multiple') {
          return (
            <div>
              <div className="space-y-3">
                {field.options?.map((option) => (
                  <label key={option.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={Array.isArray(formData[field.id]) && formData[field.id].includes(option.value)}
                      onChange={(e) => handleChange(e, field.id, 'checkbox')}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500 focus:ring-2 rounded"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
              {hasError && <p className="text-red-500 text-sm mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors[field.id]}
            </p>}
            </div>
          );
        } else {
          return (
            <div>
              <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData[field.id] || false}
                  onChange={(e) => handleChange(e, field.id, 'single-checkbox')}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500 focus:ring-2 rounded"
                />
                <span className="text-gray-700">{field.placeholder || 'Check this box'}</span>
              </label>
              {hasError && <p className="text-red-500 text-sm mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors[field.id]}
            </p>}
            </div>
          );
        }
        
      default:
        return <p className="text-red-400 p-3 bg-red-50 rounded-lg border border-red-200">Unsupported field type: {field.type}</p>;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field) => (
        <div key={field.id} className="space-y-3">
          <label className="block font-semibold text-purple-900">
            {field.label}
            {field.required && <span className="text-purple-600 ml-1">*</span>}
          </label>
          {renderField(field)}
        </div>
      ))}

      {message && (
        <div className={`p-4 rounded-lg text-sm font-medium ${
          message.includes('✅') 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {fields.length > 0 && (
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Submit Form
        </button>
      )}
    </form>
  );
}