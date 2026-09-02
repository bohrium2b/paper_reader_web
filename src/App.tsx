import { useState, useEffect, lazy, Suspense } from 'react';
import { Box, CircularProgress, Button, Typography } from "@mui/material";
import { argbFromHex, themeFromSourceColor, applyTheme } from "@material/material-color-utilities";
import type { ComponentJSON } from "./components/PageRouter";

const PageRouter = lazy(() => import('./components/PageRouter'));

function App() {
  const theme = themeFromSourceColor(argbFromHex("#E62727"));
  applyTheme(theme, { target: document.body });

  const [componentjson, setJson] = useState<ComponentJSON[] | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch('components.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        setJson(json);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 2 }}>
        <Typography variant="h6" color="error">Failed to load paper data.</Typography>
        <Button variant="contained" onClick={() => { setError(false); setLoading(true); window.location.reload(); }}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!componentjson) {
    return null;
  }

  return (
    <Worker workerUrl={workerUrl}>
      <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      }>
        <PageRouter json={componentjson} />
      </Suspense>
    </Worker>
  );
}

export default App;
