import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { CloudinaryImageSelector } from "./CloudinaryImageSelector";

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Invalid HTML. Cannot find element #root.');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <CloudinaryImageSelector />
  </React.StrictMode>
);
