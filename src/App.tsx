import { PageRouter } from "./components/PageRouter";
import * as React from 'react';
import { CircularProgress } from "@mui/material";
import {argbFromHex, themeFromSourceColor, applyTheme} from "@material/material-color-utilities";


function App() {
  const theme = themeFromSourceColor(argbFromHex("#007FFF"));
  applyTheme(theme, {target: document.body});
  const [componentjson, setJson] = React.useState(null);

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
    <PageRouter
    /*
    //@ts-ignore */
    json={componentjson} /> 
  ) 
}

export default App;
