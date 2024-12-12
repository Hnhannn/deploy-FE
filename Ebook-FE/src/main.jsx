import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import StepContext  from "./components/Form/StepContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StepContext>
      <App />
    </StepContext>
  </StrictMode>
);