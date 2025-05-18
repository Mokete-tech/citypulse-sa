import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ClerkAuthProvider } from './contexts/ClerkAuthContext';
import './index.css';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkAuthProvider>
      <App />
    </ClerkAuthProvider>
  </React.StrictMode>
);
