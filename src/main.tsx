import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { theme } from './theme.ts';
import { ThemeProvider } from '@mui/material/styles';
import { CircularProgress, Box } from '@mui/material';
import { ErrorBoundary } from './components/ErrorBoundary';

const App = lazy(() => import('./App'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <Suspense fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
          </Box>
        }>
          <App />
        </Suspense>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
)
