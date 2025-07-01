import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import '../styles/App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import {Store} from '../app/Store.js';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={Store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <App />
          <ToastContainer position="top-right" autoClose={2000} />
        </Router>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);