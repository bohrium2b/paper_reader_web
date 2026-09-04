import { ComponentJSON } from './PageRouter';
import React, { Suspense, useState, useCallback, useEffect } from 'react';
import Skeleton from "@mui/material/Skeleton";
import { saveLastVisitedPaper } from "../utils";
import { Box } from '@mui/material';

const Renderer = React.lazy(() => import('./Render').then(module => ({ default: module.Renderer || module })));
const PageNavigator = React.lazy(() => import('./PageNavigator').then(module => ({ default: module.PageNavigator || module })));

export type StatusType = {
    code?: number,
    message: string
}

export type PageProps = {
    filename: string,
    papertype: "ms" | "qp",
    paper: number,
    variant: number,
    season: "s" | "w" | "m",
    year: number,
    status?: StatusType | "success" | "TODO",
    code: number,
    key?: string
}

type PageFancyProps = PageProps & {
    papers: Array<ComponentJSON>
}

function getStorageKey(code: number, paper: number, variant: number, season: string, year: number): string {
    return `pdfPage_${code}_${paper}_${variant}_${season}${year}`;
}

function loadPage(code: number, paper: number, variant: number, season: string, year: number): number {
    const stored = localStorage.getItem(getStorageKey(code, paper, variant, season, year));
    if (stored) {
        const page = parseInt(stored, 10);
        if (!isNaN(page) && page >= 1) return page;
    }
    return 1;
}

function savePage(code: number, paper: number, variant: number, season: string, year: number, page: number): void {
    localStorage.setItem(getStorageKey(code, paper, variant, season, year), String(page));
}

export const Page = (props: PageFancyProps) => {
    document.title = `${props.filename} | ${props.code} Reader`;
    saveLastVisitedPaper(props);

    const [currentPage, setCurrentPage] = useState(() =>
        loadPage(props.code, props.paper, props.variant, props.season, props.year)
    );

    // Reload saved page when switching papers
    useEffect(() => {
        const saved = loadPage(props.code, props.paper, props.variant, props.season, props.year);
        setCurrentPage(saved);
    }, [props.code, props.paper, props.variant, props.season, props.year]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        savePage(props.code, props.paper, props.variant, props.season, props.year, page);
    }, [props.code, props.paper, props.variant, props.season, props.year]);

    return (
        <>
            <Suspense fallback={<Skeleton variant="rectangular" width="100%" height={50} sx={{borderRadius: 5}} />}>
                <PageNavigator papers={props.papers} code={props.code} currentPaper={props} />
            </Suspense>
            <Suspense fallback={<Skeleton variant="rectangular" width="100%" height={600} />}>
                <Box sx={{width: "100%", height: "100%"}}>
                    <Renderer key={props.filename} file={props.filename} initialPage={currentPage} onPageChange={handlePageChange} />
                </Box>
            </Suspense>
        </>
    );
};

export default Page;
