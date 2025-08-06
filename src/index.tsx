import React from 'react';
import ReactDOM from 'react-dom'; 
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; 
import { Toaster } from 'react-hot-toast';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="top-right" reverseOrder={false} />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root') 
);