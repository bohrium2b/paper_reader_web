import { Page } from "./Page";
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

type ComponentJSON = {
    name: string,
    paper: number,
    papers: Array<PageProps>,
    duration?: string,
    total_marks?: number
}

export function PageRouter(json: {json: Array<ComponentJSON>}) {
    //@ts-expect-error
    const loadpaper = async ({params}) => {
        var returnvalue: PageProps | string = "Not found";

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
        return returnvalue;
        // return ("File not found")
    }

    const router = createHashRouter([
        {
            path: "/",
            element: <RootRoute />,
            children: [
                {
                    path: "papers/:filename",
                    element: <PageWrapper />,
                    loader: loadpaper // @ts-ignore
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

const PageWrapper = () => {
    console.log("Inside PageWrapper.")
    //@ts-expect-error
    const data: PageProps | string = useLoaderData(); 
    if (data === "Not found") {
        return (
            <div>Not Found</div>
        )
    }
    return /*//@ts-expect-error*/ (
        <Page filename={data.filename} key={data.filename} code={data.code} paper={data.paper} papertype={data.papertype} variant={data.variant} season={data.season} year={data.year}/>
    )
}