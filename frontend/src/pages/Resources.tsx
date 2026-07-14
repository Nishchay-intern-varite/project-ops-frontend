import { useState, useEffect } from "react";
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import api from "../services/api";
interface Resource {
 id: number;
 name: string;
 role: string;
 project: string;
 email: string;
 phone: string;
}
function Resources() {
 const [resources, setResources] = useState<Resource[]>([]);
 const [search, setSearch] = useState("");
 const [open, setOpen] = useState(false);
 const [editId, setEditId] = useState<number | null>(null);
 const [form, setForm] = useState({
   name: "",
   role: "",
   project: "",
   email: "",
   phone: "",
 });
 const fetchResources = async () => {
   try {
     const res = await api.get("/resources");
     setResources(res.data);
   } catch (err) {
     console.log(err);
   }
 };
 useEffect(() => {
   fetchResources();
 }, []);
 const handleSave = async () => {
   try {
     if (editId) {
       await api.put(`/resources/${editId}`, form);
     } else {
       await api.post("/resources", form);
     }
     setOpen(false);
     setEditId(null);
     setForm({
       name: "",
       role: "",
       project: "",
       email: "",
       phone: "",
     });
     fetchResources();
   } catch (err) {
     console.log(err);
   }
 };
 const handleEdit = (item: Resource) => {
   setEditId(item.id);
   setForm({
     name: item.name,
     role: item.role,
     project: item.project,
     email: item.email,
     phone: item.phone,
   });
   setOpen(true);
 };
 const handleDelete = async (id: number) => {
   if (!window.confirm("Delete this resource?")) return;
   await api.delete(`/resources/${id}`);
   fetchResources();
 };
 const filtered = resources.filter((r) =>
   r.name.toLowerCase().includes(search.toLowerCase())
 );
 return (
<div style={{ padding: 30 }}>
<Typography variant="h4" sx={{ mb: 2 }}>
       Resources
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
             name: "",
             role: "",
             project: "",
             email: "",
             phone: "",
           });
           setOpen(true);
         }}
>
         Add Resource
</Button>
<TextField
  size="small"
  placeholder="Search..."
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
<TableCell>Name</TableCell>
<TableCell>Role</TableCell>
<TableCell>Project</TableCell>
<TableCell>Email</TableCell>
<TableCell>Phone</TableCell>
<TableCell>Actions</TableCell>
</TableRow>
</TableHead>
<TableBody>
           {filtered.length === 0 ? (
<TableRow>
<TableCell align="center" colSpan={6}>
                 No Resources Found
</TableCell>
</TableRow>
           ) : (
             filtered.map((item) => (
<TableRow key={item.id}>
<TableCell>{item.name}</TableCell>
<TableCell>{item.role}</TableCell>
<TableCell>{item.project}</TableCell>
<TableCell>{item.email}</TableCell>
<TableCell>{item.phone}</TableCell>
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
         {editId ? "Edit Resource" : "Add Resource"}
</DialogTitle>
<DialogContent>
<TextField
           fullWidth
           margin="normal"
           label="Name"
           value={form.name}
           onChange={(e) =>
             setForm({ ...form, name: e.target.value })
           }
         />
<TextField
           fullWidth
           margin="normal"
           label="Role"
           value={form.role}
           onChange={(e) =>
             setForm({ ...form, role: e.target.value })
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
           label="Email"
           value={form.email}
           onChange={(e) =>
             setForm({ ...form, email: e.target.value })
           }
         />
<TextField
           fullWidth
           margin="normal"
           label="Phone"
           value={form.phone}
           onChange={(e) =>
             setForm({ ...form, phone: e.target.value })
           }
         />
</DialogContent>
<DialogActions>
<Button onClick={() => setOpen(false)}>Cancel</Button>
<Button variant="contained" onClick={handleSave}>
           {editId ? "Update" : "Save"}
</Button>
</DialogActions>
</Dialog>
</div>
 );
}
export default Resources;