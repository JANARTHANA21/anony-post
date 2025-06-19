import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import '../styles/App.css'
import {BrowserRouter as Router} from 'react-router-dom'
import Store from '../app/Store.js'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Provider store={Store}>
    <Router>
      <App/>
    </Router>
      </Provider>
  </StrictMode>
)