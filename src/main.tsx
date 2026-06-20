import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { CustomDialogProvider } from './components/ui/CustomDialogProvider.tsx';
import { ErrorBoundary } from './features/core/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <CustomDialogProvider>
          <App />
        </CustomDialogProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
