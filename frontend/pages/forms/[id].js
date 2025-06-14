import { useRouter } from 'next/router';
import { useFormBuilder } from '@/context/FormBuilderContext';
import FormPreview from '@/components/FormPreview';
import { useEffect, useState } from 'react';

export default function FormPage() {
  const { state } = useFormBuilder();
  const router = useRouter();
  const { id } = router.query;

  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && state.savedForms[id]) {
      setFields(state.savedForms[id]);
      setLoading(false);
    } else if (id) {
      // If form ID exists but no form found, show error after a brief delay
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [id, state.savedForms]);

  const handleBackToDesigner = () => {
    router.push('/designer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-purple-800 mb-2">Loading Form</h2>
          <p className="text-purple-600">Please wait while we prepare your form...</p>
        </div>
      </div>
    );
  }

  if (!id || fields.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-purple-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                Form Not Found
              </h1>
              <button
                onClick={handleBackToDesigner}
                className="px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors font-medium"
              >
                Back to Designer
              </button>
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">Form Not Found</h2>
            <p className="text-purple-600 mb-8 max-w-md mx-auto">
              The form you're looking for doesn't exist or may have been removed. 
              Please create a new form using the form builder.
            </p>
            <button
              onClick={handleBackToDesigner}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl font-medium transform hover:-translate-y-0.5"
            >
              Create New Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                Form Preview
              </h1>
              <p className="text-purple-600 text-sm mt-1">
                Fill out the form below to test the submission
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBackToDesigner}
                className="px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors font-medium"
              >
                Back to Designer
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-6 sm:p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-purple-900">Your Form</h2>
              <div className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                {fields.length} field{fields.length !== 1 ? 's' : ''}
              </div>
            </div>
            <p className="text-purple-600 text-sm">
              This is a preview of your form. All data entered here will be submitted for testing purposes.
            </p>
          </div>
          
          <FormPreview fields={fields} />
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-purple-600">
            Need to make changes? 
            <button 
              onClick={handleBackToDesigner}
              className="ml-1 text-purple-700 hover:text-purple-800 font-medium hover:underline"
            >
              Go back to the form builder
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
