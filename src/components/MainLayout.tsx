import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import TaskIcon from '@mui/icons-material/Task';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
const DRAWER_WIDTH = 220;
const menuItems = [
 { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
 { text: 'Projects', icon: <FolderIcon />, path: '/projects' },
 { text: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
 { text: 'Resources', icon: <PeopleIcon />, path: '/resources' },
 { text: 'Timesheets', icon: <AccessTimeIcon />, path: '/timesheets' },
 { text: 'Reports', icon: <BarChartIcon />, path: '/reports' },
 { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];
function MainLayout() {
 const navigate = useNavigate();
 const location = useLocation();
 const handleLogout = () => {
   localStorage.removeItem('token');
   localStorage.removeItem('user');
   navigate('/login');
 };
 const user = JSON.parse(localStorage.getItem('user') || '{}');
 return (
<Box sx={{ display: 'flex' }}>
<AppBar position="fixed" sx={{ zIndex: 1201 }}>
<Toolbar sx={{ justifyContent: 'space-between' }}>
<Typography variant="h6">Project Ops / Delivery System</Typography>
<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
<Typography>{user.name || 'User'}</Typography>
<IconButton color="inherit" onClick={handleLogout}>
<LogoutIcon />
</IconButton>
</Box>
</Toolbar>
</AppBar>
<Drawer
       variant="permanent"
       sx={{
         width: DRAWER_WIDTH,
         flexShrink: 0,
         '& .MuiDrawer-paper': {
           width: DRAWER_WIDTH,
           boxSizing: 'border-box',
           mt: '64px'
         }
       }}
>
<List>
         {menuItems.map((item) => (
<ListItemButton
             key={item.text}
             onClick={() => navigate(item.path)}
             selected={location.pathname === item.path}
>
<ListItemIcon>{item.icon}</ListItemIcon>
<ListItemText primary={item.text} />
</ListItemButton>
         ))}
</List>
</Drawer>
<Box
       component="main"
       sx={{
         flexGrow: 1,
         p: 3,
         mt: '64px',
         ml: `${DRAWER_WIDTH}px`,
         width: `calc(100% - ${DRAWER_WIDTH}px)`
       }}
>
<Outlet />
</Box>
</Box>
 );
}
export default MainLayout;