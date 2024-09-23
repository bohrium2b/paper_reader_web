import {Renderer} from './Render';
import { Typography, Button } from '@mui/material';
import {Link} from 'react-router-dom';


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

export const Page = (props: PageProps) => {
    return (
        <>
        <Typography variant="h5">Viewing {props.season}{props.year} Paper {props.paper}{props.variant}</Typography>
        <Button variant="outlined" component={Link} to={`/papers/${props.code}_${props.season}${props.year.toString().padStart(2, '0')}_${props.papertype == 'qp' ? 'ms' : 'qp'}_${props.paper}${props.variant}.pdf`}>View {props.papertype == "qp" ? "ms" : "qp"}</Button>
        <Button variant="outlined" component={Link} to={`/papers/${props.code}_${props.season}${props.year.toString().padStart(2, '0')}_${props.papertype}_${props.paper}1.pdf`}>Variant 1</Button>
        <Button variant="outlined" component={Link} to={`/papers/${props.code}_${props.season}${props.year.toString().padStart(2, '0')}_${props.papertype}_${props.paper}2.pdf`}>Variant 2</Button>
        <Button variant="outlined" component={Link} to={`/papers/${props.code}_${props.season}${props.year.toString().padStart(2, '0')}_${props.papertype }_${props.paper}3.pdf`}>Variant 3</Button>
        <Renderer key={props.filename} file={props.filename} />
        </>
    )
}