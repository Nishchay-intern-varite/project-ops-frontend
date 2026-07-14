import { useState, useEffect } from 'react';
import {
 Typography, Paper, Table, TableBody, TableCell,
 TableHead, TableRow, Button, Dialog, DialogTitle,
 DialogContent, DialogActions, TextField, IconButton,
 MenuItem, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';
interface Task {
 id: number;
 title: string;
 description: string;
 status: string;
 priority: string;
 due_date: string;
}
function Tasks() {
 const [tasks, setTasks] = useState<Task[]>([]);
 const [open, setOpen] = useState(false);
 const [editId, setEditId] = useState<number | null>(null);
 const [form, setForm] = useState({
   title: '',
   description: '',
   status: 'To Do',
   priority: 'Medium',
   due_date: ''
 });
 const fetchTasks = async () => {
   try {
     const res = await api.get('/tasks');
     setTasks(res.data);
   } catch (error) {
     console.log('Error fetching tasks', error);
   }
 };
 useEffect(() => { fetchTasks(); }, []);
 const handleAdd = async () => {
   try {
     await api.post('/tasks', form);
     setOpen(false);
     setForm({ title: '', description: '', status: 'To Do', priority: 'Medium', due_date: '' });
     fetchTasks();
   } catch (error) {
     console.log('Error adding task', error);
   }
 };
 const handleEdit = (task: Task) => {
   setEditId(task.id);
   setForm({
     title: task.title,
     description: task.description,
     status: task.status,
     priority: task.priority,
     due_date: task.due_date || ''
   });
   setOpen(true);
 };
 const handleUpdate = async () => {
   try {
     await api.put(`/tasks/${editId}`, form);
     setOpen(false);
     setEditId(null);
     setForm({ title: '', description: '', status: 'To Do', priority: 'Medium', due_date: '' });
     fetchTasks();
   } catch (error) {
     console.log('Error updating task', error);
   }
 };
 const handleDelete = async (id: number) => {
   if (window.confirm('Delete this task?')) {
     try {
       await api.delete(`/tasks/${id}`);
       fetchTasks();
     } catch (error) {
       console.log('Error deleting task', error);
     }
   }
 };
 return (
<div style={{ padding: '30px' }}>
<Typography variant="h4" sx={{ mb: 2 }}>Tasks</Typography>
<Button
       variant="contained"
       sx={{ mb: 2 }}
       onClick={() => {
         setEditId(null);
         setForm({ title: '', description: '', status: 'To Do', priority: 'Medium', due_date: '' });
         setOpen(true);
       }}
>
       Add Task
</Button>
<Paper>
<Table>
<TableHead>
<TableRow>
<TableCell>Title</TableCell>
<TableCell>Description</TableCell>
<TableCell>Status</TableCell>
<TableCell>Priority</TableCell>
<TableCell>Due Date</TableCell>
<TableCell>Actions</TableCell>
</TableRow>
</TableHead>
<TableBody>
           {tasks.length === 0 ? (
<TableRow>
<TableCell colSpan={6} align="center">No Tasks Found</TableCell>
</TableRow>
           ) : (
             tasks.map((t) => (
<TableRow key={t.id}>
<TableCell>{t.title}</TableCell>
<TableCell>{t.description}</TableCell>
<TableCell>
<Chip
                     label={t.status}
                     color={t.status === 'Done' ? 'success' : t.status === 'In Progress' ? 'info' : 'default'}
                     size="small"
                   />
</TableCell>
<TableCell>
<Chip
                     label={t.priority}
                     color={t.priority === 'High' ? 'error' : t.priority === 'Medium' ? 'warning' : 'success'}
                     size="small"
                   />
</TableCell>
<TableCell>{t.due_date || '-'}</TableCell>
<TableCell>
<IconButton onClick={() => handleEdit(t)}><EditIcon /></IconButton>
<IconButton onClick={() => handleDelete(t.id)}><DeleteIcon /></IconButton>
</TableCell>
</TableRow>
             ))
           )}
</TableBody>
</Table>
</Paper>
<Dialog open={open} onClose={() => setOpen(false)}>
<DialogTitle>{editId ? 'Edit Task' : 'Add Task'}</DialogTitle>
<DialogContent>
<TextField fullWidth margin="normal" label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
<TextField fullWidth margin="normal" label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
<TextField select fullWidth margin="normal" label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
<MenuItem value="To Do">To Do</MenuItem>
<MenuItem value="In Progress">In Progress</MenuItem>
<MenuItem value="Done">Done</MenuItem>
</TextField>
<TextField select fullWidth margin="normal" label="Priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
<MenuItem value="Low">Low</MenuItem>
<MenuItem value="Medium">Medium</MenuItem>
<MenuItem value="High">High</MenuItem>
</TextField>
<TextField
 fullWidth margin="normal" label="Due Date" type="date"
 value={form.due_date}
 onChange={(e) => setForm({ ...form, due_date: e.target.value })}
 slotProps={{ inputLabel: { shrink: true } }}
/>
</DialogContent>
<DialogActions>
<Button onClick={() => setOpen(false)}>Cancel</Button>
<Button variant="contained" onClick={editId ? handleUpdate : handleAdd}>
           {editId ? 'Update' : 'Save'}
</Button>
</DialogActions>
</Dialog>
</div>
 );
}
export default Tasks;