import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App.tsx';
import { AuthContextProvider } from './providers/AuthProvider.tsx';
import { FhirClientProvider } from './providers/FhirClientProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthContextProvider>
      <FhirClientProvider>
        <App />
      </FhirClientProvider>
    </AuthContextProvider>
  </BrowserRouter>
);
