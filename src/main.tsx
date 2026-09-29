import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {registerWebMcpTools} from './utils/webMcpIntegration.ts';
import '../public/assets/css/main.css';
import './index.css';

// Initialize WebMCP tools for Agentic Browsing discovery
registerWebMcpTools();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
