import { createContext, useContext, useReducer } from 'react';
import { nanoid } from 'nanoid';

const FormBuilderContext = createContext();

const initialState = {
   fields: [],
  savedForms: {} 
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_FIELD':
      const newField = {
        id: nanoid(),
        type: action.payload,
        label: `${action.payload} field`,
        required: false
      };
      return { ...state, fields: [...state.fields, newField] };

    case 'UPDATE_FIELD':
      return {
        ...state,
        fields: state.fields.map((field) =>
          field.id === action.payload.id ? { ...field, ...action.payload } : field
        )
      };

    case 'REMOVE_FIELD':
      return {
        ...state,
        fields: state.fields.filter((f) => f.id !== action.payload)
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

