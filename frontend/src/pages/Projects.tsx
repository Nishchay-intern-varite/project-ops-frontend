import { Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';
import api from '../services/api';
interface Project {
 id: number;
 name: string;
 description: string;
 status: string;
 approval_status: string;
}
function Projects() {
 const [projects, setProjects] = useState<Project[]>([]);
 const [open, setOpen] = useState(false);
 const [editId, setEditId] = useState<number | null>(null);
 const [newProject, setNewProject] = useState({ name: '', description: '', status: 'Pending' });
 const fetchProjects = async () => {
   try {
     const res = await api.get('/projects');
     setProjects(res.data);
   } catch (error) {
     console.log('Failed to fetch projects', error);
   }
 };
 useEffect(() => { fetchProjects(); }, []);
 const handleAddProject = async () => {
   await api.post('/projects', newProject);
   setOpen(false);
   setNewProject({ name: '', description: '', status: 'Pending' });
   fetchProjects();
 };
 const handleEdit = (project: Project) => {
   setEditId(project.id);
   setNewProject({ name: project.name, description: project.description, status: project.status });
   setOpen(true);
 };
 const handleUpdate = async () => {
   await api.put(`/projects/${editId}`, newProject);
   setOpen(false);
   setEditId(null);
   setNewProject({ name: '', description: '', status: 'Pending' });
   fetchProjects();
 };
 const handleDelete = async (id: number) => {
   const confirmDelete = window.confirm('Are you sure you want to delete this project?');
   if (confirmDelete) {
     await api.delete(`/projects/${id}`);
     fetchProjects();
   }
 };
const handleApproval = async (id: number, value: string) => {

  try {

    console.log("Updating:", id, value);

    const res = await api.put(`/projects/${id}`, {

      approval_status: value

    });

    console.log("Response:", res.data);

    fetchProjects();

  } catch (error) {

    console.log("Approval Error:", error);

  }

};
 
 return (
<div style={{ padding: '30px' }}>
<Typography variant="h4" sx={{ mb: 2 }}>Projects</Typography>
<Button variant="contained" sx={{ mb: 2 }} onClick={() => { setEditId(null); setNewProject({ name: '', description: '', status: 'Pending' }); setOpen(true); }}>
       Add Project
</Button>
<Paper>
<Table>
<TableHead>
<TableRow>
<TableCell>Name</TableCell>
<TableCell>Description</TableCell>
<TableCell>Status</TableCell>
<TableCell>Actions</TableCell>
</TableRow>
</TableHead>
<TableBody>
           {projects.length === 0 ? (
<TableRow>
<TableCell colSpan={4} align="center">
                 No Projects Found
</TableCell>
</TableRow>
           ) : (
             projects.map((p) => (
<TableRow key={p.id}>
<TableCell>{p.name}</TableCell>
<TableCell>{p.description}</TableCell>
<TableCell>{p.approval_status}</TableCell>
<TableCell>
<IconButton onClick={() => handleEdit(p)}>
<EditIcon />
</IconButton>
<IconButton onClick={() => handleDelete(p.id)}>
<DeleteIcon />
</IconButton>
                   {p.approval_status === "Pending" && (
 
<>
<Button
                         size="small"
                         color="success"
                         variant="contained"
                         sx={{ ml: 1 }}
                         onClick={() => handleApproval(p.id, "Approved")}
>
                         Approve
</Button>
<Button
                         size="small"
                         color="error"
                         variant="contained"
                         sx={{ ml: 1 }}
                         onClick={() => handleApproval(p.id, "Rejected")}
>
                         Reject
</Button>
</>
                   )}
</TableCell>
</TableRow>
             ))
           )}
</TableBody>
</Table>
</Paper>
<Dialog open={open} onClose={() => setOpen(false)}>
<DialogTitle>{editId ? 'Edit Project' : 'Add Project'}</DialogTitle>
<DialogContent>
<TextField fullWidth margin="normal" label="Project Name" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} />
<TextField fullWidth margin="normal" label="Description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} />
<TextField select fullWidth margin="normal" label="Status" value={newProject.status} onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}>
<MenuItem value="Pending">Pending</MenuItem>
<MenuItem value="In Progress">In Progress</MenuItem>
<MenuItem value="Completed">Completed</MenuItem>
</TextField>
</DialogContent>
<DialogActions>
<Button onClick={() => setOpen(false)}>Cancel</Button>
<Button variant="contained" onClick={editId ? handleUpdate : handleAddProject}>
           {editId ? 'Update' : 'Save'}
</Button>
</DialogActions>
</Dialog>
</div>
 );
}
export default Projects;