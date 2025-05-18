import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ClerkAuthProvider } from './contexts/ClerkAuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkAuthProvider>
      <App />
    </ClerkAuthProvider>
  </React.StrictMode>
);
