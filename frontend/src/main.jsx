import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ServerGate from './components/ServerGate.jsx'
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ServerGate>
        <App />
      </ServerGate>
    </BrowserRouter>
  </StrictMode>,
)
