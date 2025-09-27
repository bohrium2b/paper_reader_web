import {  Outlet } from "react-router-dom";
// import * as React from "react";
import { /*Drawer, ListItem,*/  Box, /*Divider, List, ListItemButton*/ } from "@mui/material";


export const RootRoute = () => {
    // const [drawerisopen] = React.useState(false);
    // const drawerWidth = 240;
    return (
        <>
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
                <Outlet />
            </Box>
            



        </>
    )
}