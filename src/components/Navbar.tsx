import { AppBar, Toolbar, Typography, Avatar, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
export default function Navbar() {
 const navigate = useNavigate();
 const user = JSON.parse(
   localStorage.getItem("user") || "{}"
 );

 const logout = () => {
   localStorage.removeItem("token");
   localStorage.removeItem("user");
   navigate("/login");
 };

 return (
<AppBar
     position="fixed"
     sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
>
<Toolbar>
<Typography
         variant="h6"
         sx={{ flexGrow: 1 }}
>
         Project Ops / Delivery System
</Typography>

<Box
         sx={{
           display: "flex",
           alignItems: "center",
           gap: 2
         }}
>
<Box>
<Typography>
             {user.name || "Guest"}
</Typography>
<Typography variant="caption">
             {user.role || ""}
</Typography>
</Box>

<Avatar>
           {user.name ? user.name.charAt(0) : "U"}
</Avatar>

<Button
           color="inherit"
           onClick={logout}
>
           Logout
</Button>

</Box>

</Toolbar>
</AppBar>
 );
}