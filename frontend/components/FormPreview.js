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
    const errorClass = hasError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500';
    
    switch (field.type) {
      case 'text':
        return (
          <div>
            <input
              type={field.inputType || 'text'}
              placeholder={field.placeholder}
              required={field.required}
              className={`border p-2 w-full rounded transition-colors ${errorClass}`}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(e, field.id)}
            />
            {hasError && <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>}
          </div>
        );
        
      case 'textarea':
        return (
          <div>
            <textarea
              placeholder={field.placeholder}
              required={field.required}
              rows={field.rows || 3}
              className={`border p-2 w-full rounded transition-colors resize-vertical ${errorClass}`}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(e, field.id)}
            />
            {hasError && <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>}
          </div>
        );
        
      case 'select':
        return (
          <div>
            <select
              required={field.required}
              className={`border p-2 w-full rounded transition-colors ${errorClass}`}
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
            {hasError && <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>}
          </div>
        );
        
      case 'radio':
        return (
          <div>
            <div className="space-y-2">
              {field.options?.map((option) => (
                <label key={option.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={field.id}
                    value={option.value}
                    checked={formData[field.id] === option.value}
                    onChange={(e) => handleChange(e, field.id)}
                    className="text-blue-600"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
            {hasError && <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>}
          </div>
        );
        
      case 'checkbox':
        if (field.checkboxType === 'multiple') {
          return (
            <div>
              <div className="space-y-2">
                {field.options?.map((option) => (
                  <label key={option.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={Array.isArray(formData[field.id]) && formData[field.id].includes(option.value)}
                      onChange={(e) => handleChange(e, field.id, 'checkbox')}
                      className="text-blue-600"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              {hasError && <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>}
            </div>
          );
        } else {
          return (
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData[field.id] || false}
                  onChange={(e) => handleChange(e, field.id, 'single-checkbox')}
                  className="text-blue-600"
                />
                <span>{field.placeholder || 'Check this box'}</span>
              </label>
              {hasError && <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>}
            </div>
          );
        }
        
      default:
        return <p className="text-red-400">Unsupported field type: {field.type}</p>;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <label className="block font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {renderField(field)}
        </div>
      ))}

      {message && (
        <div className={`p-3 rounded text-sm ${
          message.includes('✅') 
            ? 'bg-green-100 text-green-700 border border-green-300' 
            : 'bg-red-100 text-red-700 border border-red-300'
        }`}>
          {message}
        </div>
      )}

      {fields.length > 0 && (
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 transition-colors font-medium"
        >
          Submit Form
        </button>
      )}
    </form>
  );
}