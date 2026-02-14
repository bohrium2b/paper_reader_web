import * as React from 'react';
import { Box, CircularProgress } from "@mui/material";
import {argbFromHex, themeFromSourceColor, applyTheme} from "@material/material-color-utilities";
import {Worker} from "@react-pdf-viewer/core";
import {lazy} from 'react';
import {Suspense} from 'react';

const PageRouter = lazy(() => import('./components/PageRouter'));


function App() {
  const theme = themeFromSourceColor(argbFromHex("#E62727"));
  applyTheme(theme, {target: document.body});
  const [componentjson, setJson] = React.useState(null);
  const workerUrl = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url
  ).toString()

  React.useEffect(() => {
    fetch('components.json')
      .then((response) => response.json())
      .then((json) => {
        setJson(json);
        console.log("Finished fetching.")
        console.log(json)
      }
    ); // @ts-ignore
  }, [])

  if (!componentjson) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }
  console.log("Received json.")
  return ( 
    <Worker workerUrl={workerUrl}>
      <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      }>
        <PageRouter
          json={componentjson} />
      </Suspense>
    </Worker>
  ) 
}

export default App;
