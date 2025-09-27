import { Renderer } from './Render';
import { Typography, Button, Box, Switch } from '@mui/material';
import { Link } from 'react-router-dom';
import { ComponentJSON } from './PageRouter';
import React from 'react';
import {Select} from "@mui/material";
import {MenuItem} from "@mui/material";
import {Home} from "@mui/icons-material";


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
    console.log("Rendering Page component for " + props.filename);
    // State for paper selector
    const [selectedComponent, setSelectedComponent] = React.useState<number>(props.paper); // Paper number
    const [selectedYear, setSelectedYear] = React.useState<number>(props.year); // Year
    const [selectedSeason, setSelectedSeason] = React.useState<string>(props.season); // Season
    const [selectedVariant, setSelectedVariant] = React.useState<number>(props.variant); // Variant
    const [selectedPapertype, setSelectedPapertype] = React.useState<"ms" | "qp">(props.papertype); // Papertype

    // Get list of components
    const [components, setComponents] = React.useState<{[key: string]: string}>({});
    React.useEffect(() => {
        console.log("Setting components.");
        props.papers.forEach((component) => {
            setComponents((prev) => ({...prev, [component.paper]: component.name}));
        });
    }, [props.papers]);
    // Get list of years for selected component
    const years = props.papers.filter((paper) => paper.paper === selectedComponent).map((paper) => (paper.papers.map((p) => p.year))).flat();
    const uniqueYears = Array.from(new Set(years)).sort((a, b) => b - a);
    console.log("Unique years: " + uniqueYears);
    return (
        <>
            <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", marginTop: "10px" }}>
                <Box style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                    <Button component={Link} to={'/'} variant="outlined" startIcon={<Home />} style={{ marginRight: "10px", marginLeft: "10px" }}>
                        Home
                    </Button>
                    <Select value={selectedComponent} onChange={(e) => {
                        setSelectedComponent(e.target.value as number);
                        // Reset year, season, variant, papertype
                        setSelectedYear(uniqueYears[0] || 0);
                        setSelectedSeason("s");
                        setSelectedVariant(1);
                        setSelectedPapertype("qp");
                    }} style={{ marginRight: "10px" }}>
                        {Object.entries(components).map(([code, name]) => (
                            <MenuItem key={code} value={parseInt(code)}>{name}</MenuItem>
                        ))}
                    </Select>
                    <Select value={selectedYear} onChange={(e) => {
                        setSelectedYear(e.target.value as number);
                        // Reset season, variant, papertype
                        setSelectedSeason("s");
                        setSelectedVariant(1);
                        setSelectedPapertype("qp");
                    }}>
                        <MenuItem key={0} value={0}>All Years</MenuItem>
                        {uniqueYears.map((year) => (
                            <MenuItem key={year} value={year}>20{year}</MenuItem>
                        ))}
                    </Select>
                    <Select value={selectedSeason} onChange={(e) => {
                        setSelectedSeason(e.target.value as "s" | "w" | "m");
                        // Reset variant, papertype
                        setSelectedVariant(1);
                        setSelectedPapertype("qp");
                    }} style={{ marginLeft: "10px", marginRight: "10px" }}>
                        <MenuItem key={"s"} value={"s"}>Summer</MenuItem>
                        <MenuItem key={"w"} value={"w"}>Winter</MenuItem>
                    </Select>
                    <Select value={selectedVariant} onChange={(e) => {
                        setSelectedVariant(e.target.value as number);
                        // Reset papertype
                        setSelectedPapertype("qp");
                    }} style={{ marginRight: "10px" }}>
                        {Array.from({ length: 3 }, (_, i) => i + 1).map((variant) => (
                            <MenuItem key={variant} value={variant}>{variant}</MenuItem>
                        ))}
                    </Select>
                    <Select value={selectedPapertype} onChange={(e) => {
                        setSelectedPapertype(e.target.value as "ms" | "qp");
                    }} style={{ marginRight: "10px" }}>
                        <MenuItem key={"qp"} value={"qp"}>Question Paper</MenuItem>
                        <MenuItem key={"ms"} value={"ms"}>Mark Scheme</MenuItem>
                    </Select>

                    <Button variant="contained" onClick={() => {
                        // Construct filename
                        const seasonCode = selectedSeason;
                        const yearCode = selectedYear.toString().padStart(2, '0');
                        const variantCode = selectedVariant.toString();
                        const papertypeCode = selectedPapertype;
                        const componentCode = selectedComponent.toString();
                        const filename = `${props.code}_${seasonCode}${yearCode}_${papertypeCode}_${componentCode}${variantCode}.pdf`;
                        // Redirect to new page
                        window.location.href = `#/papers/${filename}`;
                    }} style={{ marginRight: "10px" }}>
                        Go
                    </Button>
                </Box>
            
                <Box style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "10px", marginRight: "10px" }}>
                    {selectedVariant > 1 ? (
                        <Button
                            variant="outlined"
                            component={Link}
                            to={`/papers/${props.code}_${selectedSeason}${selectedYear
                                .toString()
                                .padStart(2, '0')}_${selectedPapertype}_${selectedComponent}${(selectedVariant - 1).toString()}.pdf`}
                            startIcon={
                                <span style={{ fontSize: 18, display: 'flex', alignItems: 'center' }}>
                                    &#8592;
                                </span>
                            }
                        >
                            Previous Variant
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            disabled
                            startIcon={
                                <span style={{ fontSize: 18, display: 'flex', alignItems: 'center' }}>
                                    &#8592;
                                </span>
                            }
                        >
                            Previous Variant
                        </Button>
                    )}
                    <Switch
                        checked={selectedPapertype === "ms"}
                        onChange={(e) => {
                            const newPapertype = e.target.checked ? "ms" : "qp";
                            setSelectedPapertype(newPapertype);
                            // Redirect to new page
                            const seasonCode = selectedSeason;
                            const yearCode = selectedYear.toString().padStart(2, '0');
                            const variantCode = selectedVariant.toString();
                            const papertypeCode = newPapertype;
                            const componentCode = selectedComponent.toString();
                            const filename = `${props.code}_${seasonCode}${yearCode}_${papertypeCode}_${componentCode}${variantCode}.pdf`;
                            window.location.href = `#/papers/${filename}`;
                        }}
                        color="primary"
                        inputProps={{ 'aria-label': 'Toggle Mark Scheme / Question Paper' }}
                    />
                    <Typography variant="body1" style={{ marginLeft: 8, marginRight: 16 }}>
                        {selectedPapertype === "ms" ? "MS" : "QP"}
                    </Typography>
                    {selectedVariant < 3 ? (
                        <Button
                            variant="outlined"
                            component={Link}
                            to={`/papers/${props.code}_${selectedSeason}${selectedYear
                                .toString()
                                .padStart(2, '0')}_${selectedPapertype}_${selectedComponent}${(selectedVariant + 1).toString()}.pdf`}
                            endIcon={
                                <span style={{ fontSize: 18, display: 'flex', alignItems: 'center' }}>
                                    &#8594;
                                </span>
                            }
                        >
                            Next Variant
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            disabled
                            endIcon={
                                <span style={{ fontSize: 18, display: 'flex', alignItems: 'center' }}>
                                    &#8594;
                                </span>
                            }
                        >
                            Next Variant
                        </Button>
                    )}
                </Box>
            </Box>

            <Renderer key={props.filename} file={props.filename} />
        </>
    )
}