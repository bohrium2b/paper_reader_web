import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

export const RootRoute = () => {
    return (
        <>
            <br />
            <Box sx={{ ml: "1%" }}>
                <Outlet />
            </Box>
        </>
    );
};
