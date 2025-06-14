import { useRouter } from 'next/router';
import { useFormBuilder } from '@/context/FormBuilderContext';
import FormPreview from '@/components/FormPreview';
import { useEffect, useState } from 'react';

export default function FormPage() {
  const { state } = useFormBuilder();
  const router = useRouter();
  const { id } = router.query;

  const [fields, setFields] = useState([]);

  useEffect(() => {
    if (id && state.savedForms[id]) {
      setFields(state.savedForms[id]);
    }
  }, [id, state.savedForms]);

  if (!id || fields.length === 0) {
    return <p className="p-6 text-gray-500">Loading form...</p>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-xl font-semibold mb-4">Form Preview</h1>
        <FormPreview fields={fields} />
      </div>
    </div>
  );
}
