import { createContext, useContext, useReducer } from 'react';
import { nanoid } from 'nanoid';
import { arrayMove } from '@dnd-kit/sortable';

const FormBuilderContext = createContext();

const initialState = {
  fields: [],
  savedForms: {} 
};

// Default field configurations
const getDefaultFieldConfig = (type) => {
  const baseConfig = {
    id: nanoid(),
    type,
    label: `${type} field`,
    required: false,
    placeholder: ''
  };

  switch (type) {
    case 'text':
      return {
        ...baseConfig,
        inputType: 'text', // text, email, number, password, tel, url
        placeholder: 'Enter text...'
      };
    
    case 'textarea':
      return {
        ...baseConfig,
        placeholder: 'Enter your message...',
        rows: 3
      };
    
    case 'select':
      return {
        ...baseConfig,
        placeholder: 'Choose an option...',
        options: [
          { id: nanoid(), label: 'Option 1', value: 'option1' },
          { id: nanoid(), label: 'Option 2', value: 'option2' }
        ]
      };
    
    case 'radio':
      return {
        ...baseConfig,
        options: [
          { id: nanoid(), label: 'Option A', value: 'optionA' },
          { id: nanoid(), label: 'Option B', value: 'optionB' }
        ]
      };
    
    case 'checkbox':
      return {
        ...baseConfig,
        checkboxType: 'single', // single or multiple
        options: [
          { id: nanoid(), label: 'Checkbox Option', value: 'checkbox1' }
        ]
      };
    
    default:
      return baseConfig;
  }
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_FIELD':
      const newField = getDefaultFieldConfig(action.payload);
      return { ...state, fields: [...state.fields, newField] };

    case 'UPDATE_FIELD':
      return {
        ...state,
        fields: state.fields.map((field) =>
          field.id === action.payload.id ? { ...field, ...action.payload } : field
        )
      };

    case 'UPDATE_FIELD_OPTIONS':
      return {
        ...state,
        fields: state.fields.map((field) =>
          field.id === action.payload.fieldId 
            ? { ...field, options: action.payload.options }
            : field
        )
      };

    case 'REMOVE_FIELD':
      return {
        ...state,
        fields: state.fields.filter((f) => f.id !== action.payload)
      };

    case 'REORDER_FIELDS':
      const { activeId, overId } = action.payload;
      const oldIndex = state.fields.findIndex(field => field.id === activeId);
      const newIndex = state.fields.findIndex(field => field.id === overId);
      
      return {
        ...state,
        fields: arrayMove(state.fields, oldIndex, newIndex)
      };

    case 'SAVE_FORM':
      return {
        ...state,
        savedForms: {
          ...state.savedForms,
          [action.payload.id]: action.payload.fields
        }
      };

    default:
      return state;
  }
}

export function FormBuilderProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <FormBuilderContext.Provider value={{ state, dispatch }}>
      {children}
    </FormBuilderContext.Provider>
  );
}

export const useFormBuilder = () => useContext(FormBuilderContext);