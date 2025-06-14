import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function FormPreview({ fields }) {
  const router = useRouter();
  const {id} = router.query;
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState(null);
 console.log(fields,formData,router)
  const handleChange = (e, id) => {
    setFormData({ ...formData, [id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null)

    try {
      const res = await axios.post(`http://localhost:5000/forms/${id}`, fields);

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
    switch (field.type) {
      case 'text':
      case 'textarea':
        return (
          <input
            type="text"
            placeholder={field.label}
            required={field.required}
            className="border p-2 w-full rounded"
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(e, field.id)}
          />
        );
      case 'select':
        return (
          <select
            required={field.required}
            className="border p-2 w-full rounded"
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(e, field.id)}
          >
            <option value="">Select</option>
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={formData[field.id] || false}
            onChange={(e) => handleChange({ target: { value: e.target.checked } }, field.id)}
          />
        );
      case 'radio':
        return (
          <div>
            <label>
              <input
                type="radio"
                name={field.id}
                value="Option A"
                checked={formData[field.id] === 'Option A'}
                onChange={(e) => handleChange(e, field.id)}
              /> Option A
            </label>
            <label className="ml-4">
              <input
                type="radio"
                name={field.id}
                value="Option B"
                checked={formData[field.id] === 'Option B'}
                onChange={(e) => handleChange(e, field.id)}
              /> Option B
            </label>
          </div>
        );
      default:
        return <p className="text-red-400">Unsupported field</p>;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.id} className="flex flex-col">
          <label className="mb-1 font-medium">{field.label}</label>
          {renderField(field)}
        </div>
      ))}

      {message && <p className="text-sm text-gray-600">{message}</p>}

      {fields.length > 0 && (
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit
        </button>
      )}
    </form>
  );
}
