import { useEffect, useState } from 'react';
import { Typography, Paper, Grid, TextField, MenuItem, Button, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';
interface Project { id: number; name: string; }
interface Resource { id: number; name: string; }
interface Allocation {
 id: number;
 project_id: number;
 resource_id: number;
 start_date: string;
 end_date: string;
 allocation_percentage: number;
 status: string;
}
export default function ResourceAllocation() {
 const [projects, setProjects] = useState<Project[]>([]);
 const [resources, setResources] = useState<Resource[]>([]);
 const [allocations, setAllocations] = useState<Allocation[]>([]);
 const [editId, setEditId] = useState<number | null>(null);
 const [message, setMessage] = useState('');
 const [form, setForm] = useState({
   project_id: '',
   resource_id: '',
   start_date: '',
   end_date: '',
   allocation_percentage: '',
   status: 'Active',
 });
 useEffect(() => { loadData(); }, []);
 const loadData = async () => {
   try {
     const [projectRes, resourceRes, allocationRes] = await Promise.all([
       api.get('/projects'),
       api.get('/resources'),
       api.get('/allocations'),
     ]);
     setProjects(projectRes.data);
     setResources(resourceRes.data);
     setAllocations(allocationRes.data);
   } catch (err) {
     console.log(err);
   }
 };
 const handleSubmit = async () => {
   try {
     if (editId) {
       await api.put(`/allocations/${editId}`, {
         project_id: Number(form.project_id),
         resource_id: Number(form.resource_id),
         start_date: form.start_date,
         end_date: form.end_date || null,
         allocation_percentage: Number(form.allocation_percentage),
         status: form.status,
       });
       setMessage('Allocation Updated Successfully');
       setEditId(null);
     } else {
       await api.post('/allocations', {
         project_id: Number(form.project_id),
         resource_id: Number(form.resource_id),
         start_date: form.start_date,
         end_date: form.end_date || null,
         allocation_percentage: Number(form.allocation_percentage),
         status: form.status,
       });
       setMessage('Allocation Added Successfully');
     }
     setForm({ project_id: '', resource_id: '', start_date: '', end_date: '', allocation_percentage: '', status: 'Active' });
     loadData();
   } catch (err: any) {
     console.log(err.response?.data);
     setMessage('Failed to Save Allocation');
   }
 };
 const handleEdit = (a: Allocation) => {
   setEditId(a.id);
   setForm({
     project_id: String(a.project_id),
     resource_id: String(a.resource_id),
     start_date: a.start_date,
     end_date: a.end_date || '',
     allocation_percentage: String(a.allocation_percentage),
     status: a.status,
   });
 };
 const handleDelete = async (id: number) => {
   if (window.confirm('Delete this allocation?')) {
     await api.delete(`/allocations/${id}`);
     loadData();
   }
 };
 const getProjectName = (id: number) => projects.find((p) => p.id === id)?.name || 'N/A';
 const getResourceName = (id: number) => resources.find((r) => r.id === id)?.name || 'N/A';
 return (
<div style={{ padding: '30px' }}>
<Typography variant="h4" gutterBottom>Resource Allocation</Typography>
     {message && <Alert sx={{ mb: 2 }}>{message}</Alert>}
<Paper sx={{ p: 3, mb: 3 }}>
<Grid container spacing={2}>
<Grid size={{ xs: 12, md: 6 }}>
<TextField fullWidth select label="Project" value={form.project_id} onChange={(e) => setForm({ ...form, project_id: e.target.value })}>
             {projects.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
</TextField>
</Grid>
<Grid size={{ xs: 12, md: 6 }}>
<TextField fullWidth select label="Resource" value={form.resource_id} onChange={(e) => setForm({ ...form, resource_id: e.target.value })}>
             {resources.map((r) => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
</TextField>
</Grid>
<Grid size={{ xs: 12, md: 6 }}>
<TextField fullWidth type="date" label="Start Date" slotProps={{ inputLabel: { shrink: true } }} value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
</Grid>
<Grid size={{ xs: 12, md: 6 }}>
<TextField fullWidth type="date" label="End Date" slotProps={{ inputLabel: { shrink: true } }} value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
</Grid>
<Grid size={{ xs: 12, md: 6 }}>
<TextField fullWidth type="number" label="Allocation %" value={form.allocation_percentage} onChange={(e) => setForm({ ...form, allocation_percentage: e.target.value })} />
</Grid>
<Grid size={{ xs: 12, md: 6 }}>
<TextField fullWidth select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
<MenuItem value="Active">Active</MenuItem>
<MenuItem value="Completed">Completed</MenuItem>
</TextField>
</Grid>
<Grid size={12}>
<Button variant="contained" onClick={handleSubmit}>{editId ? 'Update Allocation' : 'Save Allocation'}</Button>
</Grid>
</Grid>
</Paper>
<Typography variant="h5" sx={{ mb: 2 }}>Allocations</Typography>
<TableContainer component={Paper}>
<Table>
<TableHead>
<TableRow>
<TableCell>Project</TableCell>
<TableCell>Resource</TableCell>
<TableCell>Start Date</TableCell>
<TableCell>End Date</TableCell>
<TableCell>Allocation %</TableCell>
<TableCell>Status</TableCell>
<TableCell>Actions</TableCell>
</TableRow>
</TableHead>
<TableBody>
           {allocations.length === 0 ? (
<TableRow><TableCell colSpan={7} align="center">No Allocations Found</TableCell></TableRow>
           ) : (
             allocations.map((a) => (
<TableRow key={a.id}>
<TableCell>{getProjectName(a.project_id)}</TableCell>
<TableCell>{getResourceName(a.resource_id)}</TableCell>
<TableCell>{a.start_date}</TableCell>
<TableCell>{a.end_date || '-'}</TableCell>
<TableCell>{a.allocation_percentage}%</TableCell>
<TableCell>{a.status}</TableCell>
<TableCell>
<IconButton onClick={() => handleEdit(a)}><EditIcon /></IconButton>
<IconButton onClick={() => handleDelete(a.id)}><DeleteIcon /></IconButton>
</TableCell>
</TableRow>
             ))
           )}
</TableBody>
</Table>
</TableContainer>
</div>
 );
}