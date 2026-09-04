import { useEffect, useRef, useMemo } from "react";
import { GridLegacy as Grid, Box, Toolbar, Typography } from "@mui/material";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { IconButton } from "./MDButton";
import useMeasure from "react-use-measure";

import { createPluginRegistration } from '@embedpdf/core';
import { EmbedPDF } from '@embedpdf/core/react';
import { usePdfiumEngine } from '@embedpdf/engines/react';

import { Viewport, ViewportPluginPackage } from '@embedpdf/plugin-viewport/react';
import { Scroller, ScrollPluginPackage } from '@embedpdf/plugin-scroll/react';
import { DocumentContent, DocumentManagerPluginPackage } from '@embedpdf/plugin-document-manager/react';
import { RenderLayer, RenderPluginPackage } from '@embedpdf/plugin-render/react';
import { ZoomPluginPackage, ZoomMode } from '@embedpdf/plugin-zoom/react';
import { useZoom } from '@embedpdf/plugin-zoom/react';
import { useScroll } from '@embedpdf/plugin-scroll/react';
import { useScrollCapability } from '@embedpdf/plugin-scroll/react';
import { SelectionPluginPackage } from '@embedpdf/plugin-selection/react';
import { SelectionLayer } from '@embedpdf/plugin-selection/react';
import { InteractionManagerPluginPackage } from '@embedpdf/plugin-interaction-manager/react';
import { PagePointerProvider } from '@embedpdf/plugin-interaction-manager/react';
import { RotatePluginPackage } from '@embedpdf/plugin-rotate/react';
import { Rotate } from '@embedpdf/plugin-rotate/react';

type RendererProps = {
    "file": string,
    key?: string,
    initialPage?: number,
    onPageChange?: (page: number) => void,
};

const ZoomControls = ({ documentId }: { documentId: string }) => {
    const { provides: zoomProvides, state: zoomState } = useZoom(documentId);

    if (!zoomProvides) return null;

    return (
        <>
            <IconButton onClick={() => zoomProvides.zoomOut()}><ZoomOutIcon /></IconButton>
            <Typography sx={{ alignSelf: "center", marginLeft: 0.5 }}>
                {Math.round(zoomState.currentZoomLevel * 100)}%
            </Typography>
            <IconButton onClick={() => zoomProvides.zoomIn()}><ZoomInIcon /></IconButton>
        </>
    );
};

const PageControls = ({ documentId }: { documentId: string }) => {
    const { provides: scrollProvides } = useScroll(documentId);

    if (!scrollProvides) return null;

    return (
        <>
            <IconButton onClick={() => scrollProvides.scrollToPreviousPage()}><ArrowBackIosNewIcon /></IconButton>
            <Box sx={{ height: 0, padding: 0.5 }} />
            <IconButton onClick={() => scrollProvides.scrollToNextPage()}><ArrowForwardIosIcon /></IconButton>
        </>
    );
};

const ViewerContent = ({ documentId, initialPage, onPageChange }: { documentId: string; initialPage?: number; onPageChange?: (page: number) => void }) => {
    const { provides: scrollProvides } = useScroll(documentId);
    const { provides: scrollCapability } = useScrollCapability();
    const hasJumpedRef = useRef<string | null>(null);

    useEffect(() => {
        hasJumpedRef.current = null;
    }, [documentId]);

    useEffect(() => {
        if (!scrollProvides || !scrollCapability) return;

        const jumpToInitial = () => {
            if (!initialPage || initialPage < 1) return;
            if (hasJumpedRef.current === documentId) return;
            if (scrollProvides.getTotalPages() < 1) return;
            hasJumpedRef.current = documentId;
            scrollProvides.scrollToPage({ pageNumber: initialPage, behavior: 'instant' });
        };

        if (scrollProvides.getTotalPages() > 0) {
            jumpToInitial();
        }

        const unsubscribe = scrollCapability.onLayoutReady((event) => {
            if (event.documentId === documentId && event.isInitial) {
                jumpToInitial();
            }
        });

        return unsubscribe;
    }, [initialPage, scrollProvides, scrollCapability, documentId]);

    useEffect(() => {
        if (!scrollProvides || !onPageChange) return;

        const unsubscribe = scrollProvides.onPageChange((event) => {
            onPageChange(event.pageNumber);
        });

        return unsubscribe;
    }, [scrollProvides, onPageChange]);

    return (
        <Viewport documentId={documentId}>
            <Scroller
                documentId={documentId}
                renderPage={({ width, height, pageIndex, rotation }) => (
                    <PagePointerProvider documentId={documentId} pageIndex={pageIndex}>
                        <Rotate documentId={documentId} pageIndex={pageIndex} rotation={rotation}>
                            <div style={{ width, height, position: 'relative', userSelect: 'none', WebkitUserSelect: 'none' }}>
                                <RenderLayer documentId={documentId} pageIndex={pageIndex} style={{ pointerEvents: 'none' }} />
                                <SelectionLayer documentId={documentId} pageIndex={pageIndex} />
                            </div>
                        </Rotate>
                    </PagePointerProvider>
                )}
            />
        </Viewport>
    );
};

const PdfViewer = ({ file, initialPage, onPageChange }: { file: string; initialPage?: number; onPageChange?: (page: number) => void }) => {
    const plugins = useMemo(() => [
        createPluginRegistration(DocumentManagerPluginPackage, {
            initialDocuments: [{ url: file }],
        }),
        createPluginRegistration(ViewportPluginPackage),
        createPluginRegistration(ScrollPluginPackage),
        createPluginRegistration(RenderPluginPackage),
        createPluginRegistration(RotatePluginPackage),
        createPluginRegistration(InteractionManagerPluginPackage),
        createPluginRegistration(SelectionPluginPackage),
        createPluginRegistration(ZoomPluginPackage, {
            defaultZoomLevel: ZoomMode.FitWidth,
        }),
    ], [file]);

    const { engine, isLoading, error } = usePdfiumEngine();

    if (isLoading || !engine) {
        return <Typography>Loading PDF Engine...</Typography>;
    }

    if (error) {
        return <Typography color="error">Error loading engine: {error.message}</Typography>;
    }

    return (
        <EmbedPDF engine={engine} plugins={plugins}>
            {({ activeDocumentId }) =>
                activeDocumentId && (
                    <DocumentContent documentId={activeDocumentId}>
                        {({ isLoaded }) =>
                            isLoaded && (
                                <Grid container spacing={2}>
                                    <Grid item xs={11} sx={{ overflowX: "auto", overflowY: "none" }}>
                                        <Box sx={{ overflow: "auto", width: "100%", height: "87vh", paddingBottom: "10px" }}>
                                            <ViewerContent documentId={activeDocumentId} initialPage={initialPage} onPageChange={onPageChange} />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={1} position="sticky" alignItems="center" justifyContent="center">
                                        <Box position="sticky" top="0" alignItems="center">
                                            <Toolbar />
                                            <div style={{ height: "100%" }} />
                                            <ZoomControls documentId={activeDocumentId} />
                                            <Box sx={{ padding: 1.5 }} />
                                            <PageControls documentId={activeDocumentId} />
                                        </Box>
                                    </Grid>
                                </Grid>
                            )
                        }
                    </DocumentContent>
                )
            }
        </EmbedPDF>
    );
};

export const Renderer = (props: RendererProps) => {
    const [ref] = useMeasure();

    return (
        <Grid container spacing={2} ref={ref}>
            <Grid item xs={12}>
            </Grid>
            <PdfViewer
                file={props.file}
                initialPage={props.initialPage}
                onPageChange={props.onPageChange}
            />
        </Grid>
    );
};
