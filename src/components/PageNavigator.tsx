import React from 'react';
import { Button, Box, Select, MenuItem, Tooltip, Autocomplete, TextField, Switch, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowBackIos, ArrowForwardIos, Home } from '@mui/icons-material';
import type { ComponentJSON } from "./PageRouter";
import { PageProps } from './Page';
import { theme } from '../theme';
import { buildFilename } from '../utils';

export type PageNavigatorProps = {
    papers: Array<ComponentJSON>;
    code: number;
    currentPaper?: PageProps | undefined;
};

export const PageNavigator: React.FC<PageNavigatorProps> = ({ papers, code, currentPaper }) => {
    const navigate = useNavigate();

    const [selectedComponent, setSelectedComponent] = React.useState<number>(currentPaper?.paper || papers[0]?.paper || 0);
    const [selectedYear, setSelectedYear] = React.useState<number>(currentPaper?.year || 0);
    const [selectedSeason, setSelectedSeason] = React.useState<'s' | 'w' | 'm'>(currentPaper?.season || 's');
    const [selectedVariant, setSelectedVariant] = React.useState<number>(currentPaper?.variant || 1);
    const [selectedPapertype, setSelectedPapertype] = React.useState<'ms' | 'qp'>(currentPaper?.papertype || 'qp');

    const components = React.useMemo(() => {
        const map: { [key: string]: string } = {};
        papers.forEach((component) => {
            map[component.paper] = component.name;
        });
        return map;
    }, [papers]);

    const uniqueYears = React.useMemo(() => {
        const years = papers
            .filter((paper) => paper.paper === selectedComponent)
            .flatMap((paper) => paper.papers.map((p) => p.year));
        return Array.from(new Set(years)).sort((a, b) => b - a);
    }, [papers, selectedComponent]);

    React.useEffect(() => {
        if (uniqueYears.length > 0 && !uniqueYears.includes(selectedYear)) {
            setSelectedYear(uniqueYears[0]);
        }
    }, [uniqueYears, selectedYear]);

    const handleNavigate = () => {
        const filename = buildFilename(code, selectedSeason, selectedYear, selectedPapertype, selectedComponent, selectedVariant);
        navigate(`/papers/${filename}`);
    };

    const handleTogglePapertype = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPapertype = e.target.checked ? "ms" : "qp";
        setSelectedPapertype(newPapertype);
        const filename = buildFilename(code, selectedSeason, selectedYear, newPapertype, selectedComponent, selectedVariant);
        navigate(`/papers/${filename}`);
    };

    const prevFilename = buildFilename(code, selectedSeason, selectedYear, selectedPapertype, selectedComponent, selectedVariant - 1);
    const nextFilename = buildFilename(code, selectedSeason, selectedYear, selectedPapertype, selectedComponent, selectedVariant + 1);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', backgroundColor: '#f2f2f2ff', marginRight: '10px', borderRadius: '8px', paddingTop: '5px', overflow: "hidden" }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginTop: "5px", flexDirection: "column", [theme.breakpoints.up('md')]: { flexDirection: "row", alignItems: "center" }, [theme.breakpoints.down('md')]: { justifySelf: "center", justifyContent: "center", justifyItems: "center", marginLeft: "10px" } }}>
                <Button component={Link} to={'/'} variant="outlined" style={{ marginRight: '10px', marginLeft: '10px', padding: '15px' }} aria-label="Home">
                    <Home />
                </Button>
                <Tooltip title={components[selectedComponent] || 'Unknown Component'} arrow placement="top">
                    <Select
                        value={selectedComponent}
                        onChange={(e) => {
                            setSelectedComponent(e.target.value as number);
                            setSelectedYear(uniqueYears[0] || currentPaper?.year || 0);
                            setSelectedSeason('s');
                            setSelectedVariant(1);
                            setSelectedPapertype('qp');
                        }}
                        style={{ marginRight: '10px', maxWidth: '200px', minWidth: '75px' }}
                    >
                        {Object.entries(components).map(([compCode, name]) => (
                            <MenuItem key={compCode} value={parseInt(compCode)}>{name}</MenuItem>
                        ))}
                    </Select>
                </Tooltip>
                <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value as number)}>
                    <MenuItem disabled>Choose Year</MenuItem>
                    {uniqueYears.map((year) => (
                        <MenuItem key={year} value={year}>20{year}</MenuItem>
                    ))}
                </Select>
                <Select value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value as 's' | 'w' | 'm')} style={{ marginLeft: '10px', marginRight: '10px' }}>
                    <MenuItem value="s">Summer</MenuItem>
                    <MenuItem value="w">Winter</MenuItem>
                </Select>
                <Select value={selectedVariant} onChange={(e) => setSelectedVariant(e.target.value as number)} style={{ marginRight: '10px' }}>
                    {papers
                        .find((component) => component.paper === selectedComponent)
                        ?.papers
                        .filter(
                            (paper) =>
                                paper.year === selectedYear &&
                                paper.season === selectedSeason &&
                                paper.papertype === selectedPapertype
                        )
                        .map((paper) => (
                            <MenuItem key={paper.variant} value={paper.variant}>
                                {paper.variant}
                            </MenuItem>
                        ))}
                </Select>
                <Select value={selectedPapertype} onChange={(e) => setSelectedPapertype(e.target.value as 'ms' | 'qp')} style={{ marginRight: '10px' }}>
                    <MenuItem value="qp">Question Paper</MenuItem>
                    <MenuItem value="ms">Mark Scheme</MenuItem>
                </Select>
                <Button variant="contained" onClick={handleNavigate} style={{ marginRight: '10px', padding: '15px 20px' }}>
                    Go
                </Button>
            </Box>

            <Box sx={{ display: "flex", alignSelf: "center", alignItems: "center", justifyContent: "flex-start", marginBottom: "10px", marginTop: "5px", paddingRight: "10px", [theme.breakpoints.down('md')]: { display: "none" } }}>
                <Autocomplete
                    disablePortal
                    options={
                        papers
                            .flatMap(component => component.papers)
                            .map((paper) => ({
                                label: `${paper.code}/${paper.paper}${paper.variant}/${paper.season === 'w' ? 'O/N' : 'M/J'}/${paper.year}/${paper.papertype.toUpperCase()} (${paper.filename})`,
                                value: paper.filename
                            }))
                    }
                    renderInput={(params) => <TextField {...params} label="Search by filename" variant="outlined" />}
                    onChange={(_event, value) => {
                        if (value) {
                            navigate(`/papers/${value.value}`);
                        }
                    }}
                    style={{ width: 300 }}
                />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "10px", marginRight: "10px", marginTop: "5px", flex: "1 1 auto", [theme.breakpoints.down('lg')]: { flexDirection: "column", alignItems: "flex-start", display: "none" } }}>
                {selectedVariant > 1 ? (
                    <Button
                        variant="outlined"
                        component={Link}
                        to={`/papers/${prevFilename}`}
                        startIcon={<ArrowBackIos />}
                    >
                        Previous Variant
                    </Button>
                ) : (
                    <Button variant="outlined" disabled startIcon={<ArrowBackIos />}>
                        Previous Variant
                    </Button>
                )}
                <Switch
                    checked={selectedPapertype === "ms"}
                    onChange={handleTogglePapertype}
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
                        to={`/papers/${nextFilename}`}
                        endIcon={<ArrowForwardIos />}
                    >
                        Next Variant
                    </Button>
                ) : (
                    <Button variant="outlined" disabled endIcon={<ArrowForwardIos />}>
                        Next Variant
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default PageNavigator;
