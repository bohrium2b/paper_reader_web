import { Button, Typography } from "@mui/material";
import type {ComponentJSON} from "./PageRouter";
import type {PageProps} from "./Page";
import {Link} from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

import { Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";
import PageNavigator from "./PageNavigator";
import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from "@mui/material";
import { getLastVisitedPaper } from "../utils";
import { useNavigate } from "react-router-dom";

// ComponentList component to display tabs and tables


export const ComponentList = (props: { json: Array<ComponentJSON> }) => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    document.title = `Home | ${props.json[0].papers[0].code} Reader`;

    const [lastVisited] = useState<PageProps | null>(getLastVisitedPaper());
    const [openDialog, setOpenDialog] = useState(lastVisited !== null);
    const navigate = useNavigate();

    return (
        <>
            <PageNavigator 
                papers={props.json} 
                code={props.json[selectedTab]?.papers?.[0]?.code || 0} 
            />
            <Tabs value={selectedTab} onChange={handleChange} centered>
                {props.json.map((component) => (
                    <Tab key={component.name} label={component.name} />
                ))}
            </Tabs>
            {props.json.map((component, index) => (
                <Box
                    key={component.name}
                    role="tabpanel"
                    hidden={selectedTab !== index}
                    id={`tabpanel-${index}`}
                    aria-labelledby={`tab-${index}`}
                >
                    {selectedTab === index && (
                        <Box p={3}>
                            <Typography variant="h4">{component.name}</Typography>
                            <ComponentTable papers={component.papers} />
                        </Box>
                    )}
                </Box>
            ))}
            <LastVisitedDialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)} 
                lastVisited={lastVisited} 
                onVisit={() => { navigate(`/papers/${lastVisited?.filename}`); }}
            />
        </>
    );
};


export const ComponentTable = (props: {papers: Array<PageProps>}) => {
    return (
        <>
            <TableContainer component={Paper} style={{ maxWidth: '80%', margin: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Code</TableCell>
                            <TableCell>Season</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell>Paper</TableCell>
                            <TableCell>Variant</TableCell>
                            <TableCell> </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.papers
                            .filter((paper) => paper.papertype == 'qp')
                            .filter((paper) => paper.status == 'success')
                            .map((paper) => {
                                const msFilename = paper.filename.replace('_qp_', '_ms_');
                                return (
                                    <TableRow 
                                        key={paper.filename} 
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                            },
                                        }}
                                    >
                                        <TableCell>{paper.code}</TableCell>
                                        <TableCell>
                                            {paper.season === 's' ? '☀️' : paper.season === 'w' ? '⛄' : paper.season}
                                        </TableCell>
                                        <TableCell>{paper.year}</TableCell>
                                        <TableCell>{paper.paper}</TableCell>
                                        <TableCell>{paper.variant}</TableCell>
                                        <TableCell>
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                component={Link} 
                                                to={`/papers/${paper.filename}`}
                                                style={{ marginRight: '8px', textDecoration: 'none', color: 'white' }}
                                            >
                                                View QP
                                            </Button>
                                            <Button 
                                                variant="contained" 
                                                color="secondary" 
                                                component={Link} 
                                                to={`/papers/${msFilename}`}
                                                style={{ textDecoration: 'none', color: 'white' }}
                                            >
                                                View MS
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export const LastVisitedDialog = (props: { open: boolean, onClose: () => void, onVisit: () => void, lastVisited: PageProps | null }) => {
    return (
        <>
            <Dialog open={props.open} onClose={props.onClose}>
                <DialogTitle>Continue where you left off?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You last visited: {props.lastVisited?.filename}. Would you like to continue from there?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onVisit} color="primary">
                        Go to Last Visited
                    </Button>
                    <Button onClick={props.onClose} color="secondary">
                        I'll Stay Here
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ComponentList;