// StrictMode is intentionally omitted so render counts are accurate (StrictMode
// double-invokes render functions in development which would skew the counters).
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(<App />)
