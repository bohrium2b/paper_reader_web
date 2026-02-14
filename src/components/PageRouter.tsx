import type { PageProps } from "./Page";
import {RootRoute} from "./RootRoute";
import {CircularProgress} from "@mui/material";
import {
    createHashRouter,
    RouterProvider,
    useLoaderData
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {ErrorPage} from "./ErrorPage";
import React from "react";

const Page = React.lazy(() => import('./Page').then(module => ({ default: module.Page || module })));
const ComponentList = React.lazy(() => import('./ComponentList').then(module => ({ default: module.ComponentList || module })));

export type ComponentJSON = {
    name: string,
    paper: number,
    papers: Array<PageProps>,
    duration?: string,
    total_marks?: number
}

export function PageRouter(json: {json: Array<ComponentJSON>}) {
    const loadpaper = async ({params}: { params: { filename?: string } }) => {
        let returnvalue: PageProps | string = "Not found";
        console.log("Loader called for filename: " + params.filename);
        if (!json || !Array.isArray(json.json)) {
            return (json)
        }
        json.json.forEach((component) => {
            component.papers.forEach((paper) => {
                if (paper.filename == params.filename) {
                    returnvalue = paper;
                }
            })
        } )
        if (returnvalue === "Not found") {
            throw new Response("Not Found", { status: 404 });
        }
        return {paper: returnvalue, json: json.json};
    }

    const router = createHashRouter([
        {
            path: "/",
            element: <RootRoute />,
            errorElement: <ErrorPage papers={json.json} />,
            children: [
                {
                    path: "papers/:filename",
                    element: <PageWrapper json={json.json} />,
                    loader: loadpaper
                },
                {
                    // Route if no path provided
                    path: "",
                    element: <ComponentList json={json.json}/>
                }

            ]
        }
    ])

    return (
        <>
            <RouterProvider router={router} fallbackElement={(<CircularProgress />)} />

        </>
    )
}

const PageWrapper: React.FC<{ json: Array<ComponentJSON> }> = ({ json }) => {
    console.log("Inside PageWrapper.")


    const data = useLoaderData() as {paper: PageProps | string; json: Array<ComponentJSON>};
    console.log(data)
    if (data.paper === "Not found") {
        return (
            <div>Not Found</div>
        )
    }
    if (!json) {
        return (
            <div>Loading...</div>
        )
    }
    if (typeof data.paper === "string") {
        return (
            <div>Error: {data.paper}</div>
        )
    }
    return (
        <Page filename={data.paper.filename} key={data.paper.filename} code={data.paper.code} paper={data.paper.paper} papertype={data.paper.papertype} variant={data.paper.variant} season={data.paper.season} year={data.paper.year} papers={data.json}/>
    )
}



export default PageRouter;