import { Link, Outlet } from "react-router-dom";
// import * as React from "react";
import { Typography, /*Drawer, ListItem,*/ AppBar, Toolbar, Box, /*Divider, List, ListItemButton*/ } from "@mui/material";
import { Button } from "@mui/material";


export const RootRoute = () => {
    // const [drawerisopen] = React.useState(false);
    // const drawerWidth = 240;
    return (
        <>
            <AppBar position="fixed" sx={{ backgroundColor: 'white', color: 'black' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ color: 'grey' }}>
                        Past Papers
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />
                    <Button component={Link} to={'/'} sx={{ color: 'grey' }}>Home</Button>
                </Toolbar>
            </AppBar>
            {/*<Box sx={{width: drawerWidth, flexShrink: 0}}>
                <Drawer variant="persistent" anchor="left" open={drawerisopen} sx={{display: 'block', '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth}}}>
                    <Toolbar />
                    <Divider />
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton>
                                Home
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Drawer>
            </Box>*/}
            <br />
            <Box sx={{ml: "1%"}}>
                <Toolbar />
                <Outlet />
            </Box>
            



        </>
    )
}