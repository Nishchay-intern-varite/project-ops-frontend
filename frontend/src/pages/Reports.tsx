import { useEffect, useState } from 'react';
import { Typography, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';
import Button from '@mui/material/Button';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import api from '../services/api';
interface Project { id: number; name: string; status?: string; description?: string; }
interface Task { id: number; title: string; status?: string; priority?: string; }
interface Resource { id: number; name: string; role: string; project?: string; }
interface Timesheet { id: number; employee_name: string; project: string; hours: number; work_date: string; }
interface Allocation { id: number; project_id: number; resource_id: number; allocation_percentage: number; status: string; start_date: string; end_date: string; }
const Reports = () => {
 const [projects, setProjects] = useState<Project[]>([]);
 const [tasks, setTasks] = useState<Task[]>([]);
 const [resources, setResources] = useState<Resource[]>([]);
 const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
 const [allocations, setAllocations] = useState<Allocation[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 useEffect(() => { fetchReports(); }, []);
 const fetchReports = async () => {
   try {
     const [projectsRes, tasksRes, resourcesRes, timesheetsRes, allocationsRes] = await Promise.all([
       api.get('/projects'),
       api.get('/tasks'),
       api.get('/resources'),
       api.get('/timesheets'),
       api.get('/allocations'),
     ]);
     setProjects(projectsRes.data);
     setTasks(tasksRes.data);
     setResources(resourcesRes.data);
     setTimesheets(timesheetsRes.data);
     setAllocations(allocationsRes.data);
   } catch (err) {
     console.error(err);
     setError('Failed to load reports');
   } finally {
     setLoading(false);
   }
 };
 const getProjectName = (id: number) => projects.find((p) => p.id === id)?.name || 'N/A';
 const getResourceName = (id: number) => resources.find((r) => r.id === id)?.name || 'N/A';
 const exportPDF = () => {
   const doc = new jsPDF();
   doc.text('Project Report', 14, 15);
   autoTable(doc, { startY: 20, head: [['ID', 'Name', 'Status']], body: projects.map((p) => [p.id, p.name, p.status || 'N/A']) });
   doc.addPage();
   doc.text('Task Report', 14, 15);
   autoTable(doc, { startY: 20, head: [['ID', 'Title', 'Status', 'Priority']], body: tasks.map((t) => [t.id, t.title, t.status || 'N/A', t.priority || 'N/A']) });
   doc.addPage();
   doc.text('Resource Report', 14, 15);
   autoTable(doc, { startY: 20, head: [['ID', 'Name', 'Role', 'Project']], body: resources.map((r) => [r.id, r.name, r.role, r.project || 'N/A']) });
   doc.addPage();
   doc.text('Timesheet Report', 14, 15);
   autoTable(doc, { startY: 20, head: [['ID', 'Employee', 'Project', 'Hours', 'Date']], body: timesheets.map((s) => [s.id, s.employee_name, s.project, s.hours, s.work_date]) });
   doc.addPage();
   doc.text('Allocation Report', 14, 15);
   autoTable(doc, { startY: 20, head: [['ID', 'Project', 'Resource', 'Allocation %', 'Status']], body: allocations.map((a) => [a.id, getProjectName(a.project_id), getResourceName(a.resource_id), `${a.allocation_percentage}%`, a.status]) });
   doc.save('Project_Report.pdf');
 };
 const exportExcel = () => {
   const workbook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(projects), 'Projects');
   XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(tasks), 'Tasks');
   XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(resources), 'Resources');
   XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(timesheets), 'Timesheets');
   const allocationSheet = allocations.map((a) => ({
     Project: getProjectName(a.project_id),
     Resource: getResourceName(a.resource_id),
     'Allocation %': `${a.allocation_percentage}%`,
     Status: a.status,
     'Start Date': a.start_date,
     'End Date': a.end_date || '',
   }));
   XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(allocationSheet), 'Allocations');
   XLSX.writeFile(workbook, 'Project_Report.xlsx');
 };
 if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}><CircularProgress /></div>;
 if (error) return <Alert severity="error">{error}</Alert>;
 return (
<div style={{ padding: '30px' }}>
<Typography variant="h4" gutterBottom>Reports</Typography>
<div style={{ marginBottom: 20 }}>
<Button variant="contained" onClick={exportPDF} sx={{ mr: 2 }}>Export PDF</Button>
<Button variant="contained" color="success" onClick={exportExcel}>Export Excel</Button>
</div>
<Grid container spacing={3}>
<Grid item xs={12} md={3}><Card><CardContent><Typography>Projects</Typography><Typography variant="h4">{projects.length}</Typography></CardContent></Card></Grid>
<Grid item xs={12} md={3}><Card><CardContent><Typography>Tasks</Typography><Typography variant="h4">{tasks.length}</Typography></CardContent></Card></Grid>
<Grid item xs={12} md={3}><Card><CardContent><Typography>Resources</Typography><Typography variant="h4">{resources.length}</Typography></CardContent></Card></Grid>
<Grid item xs={12} md={3}><Card><CardContent><Typography>Timesheets</Typography><Typography variant="h4">{timesheets.length}</Typography></CardContent></Card></Grid>
<Grid item xs={12} md={3}><Card><CardContent><Typography>Allocations</Typography><Typography variant="h4">{allocations.length}</Typography></CardContent></Card></Grid>
</Grid>
<Typography variant="h5" sx={{ mt: 5, mb: 2 }}>Project Report</Typography>
<TableContainer component={Paper}><Table>
<TableHead><TableRow><TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
<TableBody>{projects.map((p) => (<TableRow key={p.id}><TableCell>{p.id}</TableCell><TableCell>{p.name}</TableCell><TableCell>{p.status || 'N/A'}</TableCell></TableRow>))}</TableBody>
</Table></TableContainer>
<Typography variant="h5" sx={{ mt: 5, mb: 2 }}>Task Report</Typography>
<TableContainer component={Paper}><Table>
<TableHead><TableRow><TableCell>ID</TableCell><TableCell>Title</TableCell><TableCell>Status</TableCell><TableCell>Priority</TableCell></TableRow></TableHead>
<TableBody>{tasks.map((t) => (<TableRow key={t.id}><TableCell>{t.id}</TableCell><TableCell>{t.title}</TableCell><TableCell>{t.status || 'N/A'}</TableCell><TableCell>{t.priority || 'N/A'}</TableCell></TableRow>))}</TableBody>
</Table></TableContainer>
<Typography variant="h5" sx={{ mt: 5, mb: 2 }}>Resource Report</Typography>
<TableContainer component={Paper}><Table>
<TableHead><TableRow><TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>Role</TableCell><TableCell>Project</TableCell></TableRow></TableHead>
<TableBody>{resources.map((r) => (<TableRow key={r.id}><TableCell>{r.id}</TableCell><TableCell>{r.name}</TableCell><TableCell>{r.role}</TableCell><TableCell>{r.project || 'N/A'}</TableCell></TableRow>))}</TableBody>
</Table></TableContainer>
<Typography variant="h5" sx={{ mt: 5, mb: 2 }}>Timesheet Report</Typography>
<TableContainer component={Paper}><Table>
<TableHead><TableRow><TableCell>ID</TableCell><TableCell>Employee</TableCell><TableCell>Project</TableCell><TableCell>Hours</TableCell><TableCell>Date</TableCell></TableRow></TableHead>
<TableBody>{timesheets.map((s) => (<TableRow key={s.id}><TableCell>{s.id}</TableCell><TableCell>{s.employee_name}</TableCell><TableCell>{s.project}</TableCell><TableCell>{s.hours}</TableCell><TableCell>{s.work_date}</TableCell></TableRow>))}</TableBody>
</Table></TableContainer>
<Typography variant="h5" sx={{ mt: 5, mb: 2 }}>Allocation Report</Typography>
<TableContainer component={Paper}><Table>
<TableHead><TableRow><TableCell>ID</TableCell><TableCell>Project</TableCell><TableCell>Resource</TableCell><TableCell>Allocation %</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
<TableBody>
         {allocations.map((a) => (
<TableRow key={a.id}>
<TableCell>{a.id}</TableCell>
<TableCell>{getProjectName(a.project_id)}</TableCell>
<TableCell>{getResourceName(a.resource_id)}</TableCell>
<TableCell>{a.allocation_percentage}%</TableCell>
<TableCell>{a.status}</TableCell>
</TableRow>
         ))}
</TableBody>
</Table></TableContainer>
</div>
 );
};
export default Reports;