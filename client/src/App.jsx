import React from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './components/dashboard';
import './App.css';

function App() {
  return <Dashboard />;
}

createRoot(document.getElementById('root')).render(<App />);
