import { Viewer } from "@react-pdf-viewer/core";
import type { PageChangeEvent } from "@react-pdf-viewer/core";
import { useState, useRef } from "react";
import { Grid2, TextField, Box, Toolbar, Typography } from "@mui/material";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import useMeasure from 'react-use-measure';
import MDButton, { IconButton } from "./MDButton";
import '@react-pdf-viewer/core/lib/styles/index.css';

import { zoomPlugin, RenderZoomInProps, RenderZoomOutProps, RenderCurrentScaleProps } from '@react-pdf-viewer/zoom';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';

// Import styles
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
// Import styles
import '@react-pdf-viewer/zoom/lib/styles/index.css';

type RendererProps = {
    "file": string,
    key?: string
}




export const Renderer = (props: RendererProps) => {
    const [ref, bounds] = useMeasure();
    const [currentpage, setCurrentpage] = useState(1);
    const [pagescale, setpagescale] = useState(1);
    const [numPages, setnumpages] = useState<number>();
    const pagenumberRef = useRef<HTMLDivElement>(null);
    const zoomPluginInstance = zoomPlugin();
    const pageNavigationPluginInstance = pageNavigationPlugin();
    const {GoToNextPage, GoToPreviousPage} = pageNavigationPluginInstance;
    return (
        <>
            <Grid2 container spacing={2}>
                <Grid2 size={12}>
                    <MDButton variant="filledTonal" onClick={() => { setpagescale(1) }}>Reset Zoom</MDButton>
                </Grid2>
                <Grid2 size={10} ref={ref} sx={{ overflowX: "auto", overflowY: "hidden" }}>
                    {/* @ts-ignore */}
                    <Viewer fileUrl={props.file} plugins={[zoomPluginInstance, pageNavigationPluginInstance]} onPageChange={(e: PageChangeEvent) => { setCurrentpage(e.currentPage + 1); pagenumberRef.current.value = e.currentPage + 1; }} pageLayout={{
                        // @ts-ignore
                        buildPageStyles: ({ numPages, pageIndex }) => {
                            setnumpages(numPages);
                        }
                    }} />
                </Grid2>
                <Grid2 size={2} position="sticky" alignItems="center" justifyContent="center">
                    <Box position="sticky" top="0" alignItems="center">
                        <Toolbar />
                        <div style={{ height: "10px" }}></div>
                        <zoomPluginInstance.ZoomOut>
                            {
                                (props: RenderZoomOutProps) => (
                                    <IconButton onClick={props.onClick}><ZoomOutIcon /></IconButton>
                                )
                            }
                        </zoomPluginInstance.ZoomOut> <br />
                        <Typography><zoomPluginInstance.CurrentScale>{(props: RenderCurrentScaleProps) => <>{`${Math.round(props.scale * 100)}%`}</>}</zoomPluginInstance.CurrentScale></Typography>
                        <zoomPluginInstance.ZoomIn>
                            {
                                (props: RenderZoomInProps) => (
                                    <IconButton onClick={props.onClick}><ZoomInIcon /></IconButton>
                                )
                            }
                        </zoomPluginInstance.ZoomIn>
                        <Box display="flex" sx={{ verticalAlign: "middle", alignItems: "center" }}><TextField variant="standard" value={(pagescale * 100).toFixed(0)} onChange={(event) => { parseInt(event.target.value) ? setpagescale(parseInt(event.target.value) / 100) : setpagescale(1) }} sx={{ width: "3em", justifyContent: "center" }} /><Typography display="inline" sx={{ verticalAlign: "middle" }}>%</Typography></Box>
                        <IconButton disabled={currentpage == 1} onClick={() => {
                            //@ts-ignore 
                            pagenumberRef.current.value = currentpage - 1; setCurrentpage(currentpage - 1)
                        }}><ArrowBackIosNewIcon /></IconButton> <br />
                        <Box display="flex" sx={{ verticalAlign: "middle", alignItems: "center" }}><TextField inputRef={pagenumberRef} variant="standard" defaultValue={currentpage ? currentpage : 1} onKeyDown={(event) => {
                            if (event.key == "Enter") { //@ts-ignore
                                setCurrentpage(parseInt(pagenumberRef.current?.value ? pagenumberRef.current?.value : "1"));
                            }
                        }} sx={{ width: "1.5em", justifyContent: "center" }} /><Typography display="inline" sx={{ verticalAlign: "middle" }}>/{numPages}</Typography></Box>
                        <IconButton disabled={currentpage == numPages} onClick={() => {
                            //@ts-ignore
                            pagenumberRef.current.value = currentpage + 1; setCurrentpage(currentpage + 1)
                        }}><ArrowForwardIosIcon /></IconButton>
                    </Box>

                </Grid2>
            </Grid2>

        </>

    )
}

