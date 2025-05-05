import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Get the root element
const rootElement = document.getElementById('root');

// Only render if the root element exists
if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
  } catch (error) {
    console.error('Error rendering app:', error);

    // Fallback if rendering fails
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif; margin-top: 50px;">
          <h1>Failed to load application</h1>
          <p>We're sorry, but there was an error loading the application.</p>
          <button onclick="window.location.reload()"
            style="padding: 10px 20px; background: #0EA5E9; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 20px;">
            Reload Page
          </button>
        </div>
      `;
    }
  }
}
