import {
 Drawer,
 List,
 ListItemButton,
 ListItemIcon,
 ListItemText,
 Toolbar,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import TaskIcon from "@mui/icons-material/Task";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link } from "react-router-dom";

const drawerWidth = 240;

export default function Sidebar() {

 const user = JSON.parse(
   localStorage.getItem("user") || "{}"
 );

 const role = user.role || "Employee";

 return (
<Drawer
     variant="permanent"
     sx={{
       width: drawerWidth,
       "& .MuiDrawer-paper": {
         width: drawerWidth,
         boxSizing: "border-box",
       },
     }}
>
<Toolbar />
<List>

       {/* Everyone */}
<ListItemButton component={Link} to="/">
<ListItemIcon>
<DashboardIcon />
</ListItemIcon>
<ListItemText primary="Dashboard" />
</ListItemButton>

       {/* Admin + Manager */}
       {(role === "Admin" || role === "Manager") && (
<ListItemButton component={Link} to="/projects">
<ListItemIcon>
<FolderIcon />
</ListItemIcon>
<ListItemText primary="Projects" />
</ListItemButton>
       )}

       {/* Everyone */}
<ListItemButton component={Link} to="/tasks">
<ListItemIcon>
<TaskIcon />
</ListItemIcon>
<ListItemText primary="Tasks" />
</ListItemButton>


       {/* Admin + Manager */}
       {(role === "Admin" || role === "Manager") && (
<ListItemButton component={Link} to="/resources">
<ListItemIcon>
<PeopleIcon />
</ListItemIcon>
<ListItemText primary="Resources" />
</ListItemButton>
       )}


       {/* Everyone */}
<ListItemButton component={Link} to="/timesheets">
<ListItemIcon>
<AccessTimeIcon />
</ListItemIcon>
<ListItemText primary="Timesheets" />
</ListItemButton>


       {/* Admin + Manager */}
       {(role === "Admin" || role === "Manager") && (
<ListItemButton component={Link} to="/reports">
<ListItemIcon>
<AssessmentIcon />
</ListItemIcon>
<ListItemText primary="Reports" />
</ListItemButton>

       )}

<ListItemButton component={Link} to="/allocations">
<ListItemText primary="Resource Allocation" />
</ListItemButton>

       {/* Only Admin */}
       {role === "Admin" && (
<ListItemButton component={Link} to="/users">
<ListItemIcon>
<PeopleIcon />
</ListItemIcon>
<ListItemText primary="Users" />
</ListItemButton>
       )}


       {/* Everyone */}
<ListItemButton component={Link} to="/settings">
<ListItemIcon>
<SettingsIcon />
</ListItemIcon>
<ListItemText primary="Settings" />
</ListItemButton>

</List>

</Drawer>
 );
}