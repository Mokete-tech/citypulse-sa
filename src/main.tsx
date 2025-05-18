import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ClerkAuthProvider } from './contexts/ClerkAuthContext';
import './index.css';
import './App.css';
import { ErrorBoundary } from './components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ClerkAuthProvider>
        <App />
      </ClerkAuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
