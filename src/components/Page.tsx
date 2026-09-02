import { ComponentJSON } from './PageRouter';
import React, { Suspense } from 'react';
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

export const Page = (props: PageFancyProps) => {
    document.title = `${props.filename} | ${props.code} Reader`;
    saveLastVisitedPaper(props);
    return (
        <>
            <Suspense fallback={<Skeleton variant="rectangular" width="100%" height={50} sx={{borderRadius: 5}} />}>
                <PageNavigator papers={props.papers} code={props.code} currentPaper={props} />
            </Suspense>
            <Suspense fallback={<Skeleton variant="rectangular" width="100%" height={600} />}>
                <Box sx={{width: "100%", height: "100%"}}>
                    <Renderer key={props.filename} file={props.filename} />
                </Box>
            </Suspense>
        </>
    );
};

export default Page;