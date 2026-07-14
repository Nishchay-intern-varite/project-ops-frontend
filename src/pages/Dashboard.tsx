import { useEffect, useState } from "react";
import api from "../services/api";
import {
 Grid,
 Paper,
 Typography,
 CircularProgress,
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableRow,
} from "@mui/material";
interface Project {
 id: number;
 name: string;
 status: string;
}
interface Task {
 id: number;
 title: string;
 status: string;
}
export default function Dashboard() {
 const [projects, setProjects] = useState<Project[]>([]);
 const [tasks, setTasks] = useState<Task[]>([]);
 const [loading, setLoading] = useState(true);
 useEffect(() => {
   loadDashboard();
 }, []);
 const loadDashboard = async () => {
   try {
     const [projectRes, taskRes] = await Promise.all([
       api.get("/projects"),
       api.get("/tasks"),
     ]);
     setProjects(projectRes.data || []);
     setTasks(taskRes.data || []);
   } catch (error) {
     console.log(error);
   } finally {
     setLoading(false);
   }
 };
 if (loading) {
   return <CircularProgress />;
 }
 const totalProjects = projects.length;
 const pendingProjects = projects.filter(
   (p) => p.status === "Pending"
 ).length;
 const inProgressProjects = projects.filter(
   (p) => p.status === "In Progress"
 ).length;
 const completedProjects = projects.filter(
   (p) => p.status === "Completed"
 ).length;
 const totalTasks = tasks.length;
 const completedTasks = tasks.filter(
   (t) => t.status === "Done"
 ).length;
 return (
<>
<Typography variant="h4" sx={{ mb: 3 }}>
       Dashboard
</Typography>
<Grid container spacing={3}>
<Grid size={{ xs: 12, sm: 6, md: 4 }}>
<Paper sx={{ p: 3 }}>
<Typography variant="h6">Total Projects</Typography>
<Typography variant="h3">{totalProjects}</Typography>
</Paper>
</Grid>
<Grid size={{ xs: 12, sm: 6, md: 4 }}>
<Paper sx={{ p: 3 }}>
<Typography variant="h6">Pending</Typography>
<Typography variant="h3">{pendingProjects}</Typography>
</Paper>
</Grid>
<Grid size={{ xs: 12, sm: 6, md: 4 }}>
<Paper sx={{ p: 3 }}>
<Typography variant="h6">In Progress</Typography>
<Typography variant="h3">{inProgressProjects}</Typography>
</Paper>
</Grid>
<Grid size={{ xs: 12, sm: 6, md: 4 }}>
<Paper sx={{ p: 3 }}>
<Typography variant="h6">Completed</Typography>
<Typography variant="h3">{completedProjects}</Typography>
</Paper>
</Grid>
<Grid size={{ xs: 12, sm: 6, md: 4 }}>
<Paper sx={{ p: 3 }}>
<Typography variant="h6">Total Tasks</Typography>
<Typography variant="h3">{totalTasks}</Typography>
</Paper>
</Grid>
<Grid size={{ xs: 12, sm: 6, md: 4 }}>
<Paper sx={{ p: 3 }}>
<Typography variant="h6">Completed Tasks</Typography>
<Typography variant="h3">{completedTasks}</Typography>
</Paper>
</Grid>
<Grid size={{ xs: 12 }}>
<Paper sx={{ p: 2 }}>
<Typography variant="h6" sx={{ mb: 2 }}>
             Recent Projects
</Typography>
<Table>
<TableHead>
<TableRow>
<TableCell>Project</TableCell>
<TableCell>Status</TableCell>
</TableRow>
</TableHead>
<TableBody>
               {projects.slice(0, 5).map((project) => (
<TableRow key={project.id}>
<TableCell>{project.name}</TableCell>
<TableCell>{project.status}</TableCell>
</TableRow>
               ))}
               {projects.length === 0 && (
<TableRow>
<TableCell colSpan={2} align="center">
                     No Projects Found
</TableCell>
</TableRow>
               )}
</TableBody>
</Table>
</Paper>
</Grid>
</Grid>
</>
 );
}