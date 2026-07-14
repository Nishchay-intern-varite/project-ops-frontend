import { useEffect, useState } from "react";
import {
 Typography,
 Paper,
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableRow,
 Button,
 Dialog,
 DialogTitle,
 DialogContent,
 DialogActions,
 TextField,
 IconButton,
 InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../services/api";
interface Timesheet {
 id: number;
 employee_name: string;
 project: string;
 task: string;
 hours: number;
 work_date: string;
}
function Timesheets() {
 const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
 const [search, setSearch] = useState("");
 const [open, setOpen] = useState(false);
 const [editId, setEditId] = useState<number | null>(null);
 const [form, setForm] = useState({
   employee_name: "",
   project: "",
   task: "",
   hours: "",
   work_date: "",
 });
 const fetchTimesheets = async () => {
   try {
     const res = await api.get("/timesheets");
     setTimesheets(res.data);
   } catch (err) {
     console.log(err);
   }
 };
 useEffect(() => {
   fetchTimesheets();
 }, []);
 const handleSave = async () => {
   if (editId) {
     await api.put(`/timesheets/${editId}`, form);
   } else {
     await api.post("/timesheets", form);
   }
   setOpen(false);
   setEditId(null);
   setForm({
     employee_name: "",
     project: "",
     task: "",
     hours: "",
     work_date: "",
   });
   fetchTimesheets();
 };
 const handleEdit = (item: Timesheet) => {
   setEditId(item.id);
   setForm({
     employee_name: item.employee_name,
     project: item.project,
     task: item.task,
     hours: item.hours.toString(),
     work_date: item.work_date,
   });
   setOpen(true);
 };
 const handleDelete = async (id: number) => {
   if (!window.confirm("Delete this timesheet?")) return;
   await api.delete(`/timesheets/${id}`);
   fetchTimesheets();
 };
 const filtered = timesheets.filter((t) =>
   t.employee_name.toLowerCase().includes(search.toLowerCase())
 );
 return (
<div style={{ padding: 30 }}>
<Typography variant="h4" sx={{ mb: 2 }}>
       Timesheets
</Typography>
<div
       style={{
         display: "flex",
         gap: 15,
         marginBottom: 20,
       }}
>
<Button
         variant="contained"
         onClick={() => {
           setEditId(null);
           setForm({
             employee_name: "",
             project: "",
             task: "",
             hours: "",
             work_date: "",
           });
           setOpen(true);
         }}
>
         Add Timesheet
</Button>

<TextField
  size="small"
  placeholder="Search Employee..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  slotProps={{
    input: {
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
    },
  }}
/>

</div>
<Paper>
<Table>
<TableHead>
<TableRow>
<TableCell>Employee</TableCell>
<TableCell>Project</TableCell>
<TableCell>Task</TableCell>
<TableCell>Hours</TableCell>
<TableCell>Date</TableCell>
<TableCell>Actions</TableCell>
</TableRow>
</TableHead>
<TableBody>
           {filtered.length === 0 ? (
<TableRow>
<TableCell align="center" colSpan={6}>
                 No Timesheets Found
</TableCell>
</TableRow>
           ) : (
             filtered.map((item) => (
<TableRow key={item.id}>
<TableCell>{item.employee_name}</TableCell>
<TableCell>{item.project}</TableCell>
<TableCell>{item.task}</TableCell>
<TableCell>{item.hours}</TableCell>
<TableCell>{item.work_date}</TableCell>
<TableCell>
<IconButton onClick={() => handleEdit(item)}>
<EditIcon />
</IconButton>
<IconButton onClick={() => handleDelete(item.id)}>
<DeleteIcon />
</IconButton>
</TableCell>
</TableRow>
             ))
           )}
</TableBody>
</Table>
</Paper>
<Dialog open={open} onClose={() => setOpen(false)}>
<DialogTitle>
         {editId ? "Edit Timesheet" : "Add Timesheet"}
</DialogTitle>
<DialogContent>
<TextField
           fullWidth
           margin="normal"
           label="Employee Name"
           value={form.employee_name}
           onChange={(e) =>
             setForm({ ...form, employee_name: e.target.value })
           }
         />
<TextField
           fullWidth
           margin="normal"
           label="Project"
           value={form.project}
           onChange={(e) =>
             setForm({ ...form, project: e.target.value })
           }
         />
<TextField
           fullWidth
           margin="normal"
           label="Task"
           value={form.task}
           onChange={(e) =>
             setForm({ ...form, task: e.target.value })
           }
         />
<TextField
           fullWidth
           margin="normal"
           type="number"
           label="Hours"
           value={form.hours}
           onChange={(e) =>
             setForm({ ...form, hours: e.target.value })
           }
         />
<TextField
  fullWidth
  margin="normal"
  type="date"
  label="Work Date"
  slotProps={{
    inputLabel: {
      shrink: true,
    },
  }}
  value={form.work_date}
  onChange={(e) =>
    setForm({ ...form, work_date: e.target.value })
  }
/>
</DialogContent>
<DialogActions>
<Button onClick={() => setOpen(false)}>
           Cancel
</Button>
<Button variant="contained" onClick={handleSave}>
           {editId ? "Update" : "Save"}
</Button>
</DialogActions>
</Dialog>
</div>
 );
}
export default Timesheets;