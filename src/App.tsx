import { PageRouter } from "./components/PageRouter";
import * as React from 'react';
import { CircularProgress } from "@mui/material";
import {argbFromHex, themeFromSourceColor, applyTheme} from "@material/material-color-utilities";
import {Worker} from "@react-pdf-viewer/core"


function App() {
  const theme = themeFromSourceColor(argbFromHex("#007FFF"));
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
      <CircularProgress />
    )
  }
  console.log("Received json.")
  
  return ( 
    <Worker workerUrl={workerUrl}>
    <PageRouter
    /*
    //@ts-ignore */
    json={componentjson} /> 
    </Worker>
  ) 
}

export default App;
