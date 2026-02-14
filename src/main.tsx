import { StrictMode, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { theme } from './theme.ts';
import { ThemeProvider } from '@mui/material/styles';

const App = lazy(() => import('./App'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
  </StrictMode>,
)
