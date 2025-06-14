import '@/styles/globals.css';
import { FormBuilderProvider } from '@/context/FormBuilderContext';

export default function App({ Component, pageProps }) {
  return (
    <FormBuilderProvider>
      <Component {...pageProps} />
    </FormBuilderProvider>
  );
}


