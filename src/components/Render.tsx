import { Document, pdfjs, Page } from "react-pdf";
import { useState, useRef } from "react";
import { Grid2, TextField, Box, Toolbar, Typography } from "@mui/material";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import type { PDFDocumentProxy } from "pdfjs-dist";
import useMeasure from 'react-use-measure';
import MDButton, {IconButton} from "./MDButton";


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
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    const onDocumentLoadSuccess = ({ numPages: numPages }: PDFDocumentProxy) => {
        setnumpages(numPages);
    };
    return (
        <>
            <Grid2 container spacing={2}>
                <Grid2 size={12}>
                    <MDButton onClick={() => { setpagescale(1) }}>Reset Zoom</MDButton>
                </Grid2>
                <Grid2 size={10} ref={ref} sx={{overflowX: "auto", overflowY: "hidden"}}>
                    {/*
                    //@ts-expect-error */}
                    <Document key={props.file} file={props.file} onLoadSuccess={onDocumentLoadSuccess}>
                        <Page
                            pageNumber={currentpage}
                            scale={pagescale}
                            width={bounds.width - 10}
                        />
                    </Document>
                </Grid2>
                <Grid2 size={2} position="sticky" alignItems="center" justifyContent="center">
                    <Box position="sticky" top="0" alignItems="center">
                    <Toolbar />
                    <IconButton onClick={() => {
                        setpagescale(pagescale * 0.8)
                    }}><ZoomOutIcon /></IconButton>
                    <br />
                    <Box display="flex" sx={{verticalAlign:"middle", alignItems: "center"}}><TextField variant="standard" value={(pagescale * 100).toFixed(0)} onChange={(event) => {parseInt(event.target.value) ? setpagescale(parseInt(event.target.value) / 100) : setpagescale(1)}} sx={{width:"3em", justifyContent: "center"}} /><Typography display="inline" sx={{verticalAlign: "middle"}}>%</Typography></Box>
                    <IconButton disabled={pagescale >= 2.1} onClick={() => {

                        setpagescale(pagescale * 1.2)
                    }}><ZoomInIcon /></IconButton> <br />
                    <IconButton disabled={currentpage == 1} onClick={() => {
                    //@ts-ignore 
                        pagenumberRef.current.value = currentpage - 1;setCurrentpage(currentpage - 1) 
                        }}><ArrowBackIosNewIcon /></IconButton> <br />
                    <Box display="flex" sx={{verticalAlign:"middle", alignItems: "center"}}><TextField inputRef={pagenumberRef} variant="standard" defaultValue={currentpage ? currentpage : 1} onKeyDown={(event) => {
                        if (event.key == "Enter") { //@ts-ignore
                            setCurrentpage(parseInt(pagenumberRef.current?.value ? pagenumberRef.current?.value : "1"));
                        }
                    }} sx={{width:"1.5em", justifyContent: "center"}} /><Typography display="inline" sx={{verticalAlign: "middle"}}>/{numPages}</Typography></Box>
                    <IconButton disabled={currentpage == numPages} onClick={() => { 
                        //@ts-ignore
                        pagenumberRef.current.value = currentpage + 1;setCurrentpage(currentpage + 1) 
                        }}><ArrowForwardIosIcon /></IconButton>
                    </Box>
                    
                </Grid2>
            </Grid2>

        </>

    )
}

