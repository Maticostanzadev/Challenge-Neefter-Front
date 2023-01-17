import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import axios from 'axios';

axios.defaults.baseURL = "https://challenge-neefter-back-production.up.railway.app"
// axios.defaults.baseURL = "http://localhost:3001"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)