import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './root/index.js';
import './index.scss';
import { BrowserRouter as Router } from 'react-router-dom';

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <StrictMode>
      <Router>
        <App />
      </Router>
    </StrictMode>
  );
} else
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file."
  );
