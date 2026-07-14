import { useEffect, useState } from "react";
import {
 Typography,
 Table,
 TableBody,
 TableCell,
 TableContainer,
 TableHead,
 TableRow,
 Paper,
 Button,
 Select,
 MenuItem,
 CircularProgress,
 Alert,
} from "@mui/material";
import api from "../services/api";

interface User {
 id: number;
 name: string;
 email: string;
 role: string;
}

const UserManagement = () => {
 const [users, setUsers] = useState<User[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");

 useEffect(() => {
   fetchUsers();
 }, []);

 const fetchUsers = async () => {
   try {
     const response = await api.get("/users");
     setUsers(response.data);
   } catch (err) {
     console.error(err);
     setError("Failed to load users");
   } finally {
     setLoading(false);
   }
 };

 const updateRole = async (
   id:number,
   role:string,
   name:string
 ) => {
   try {
     await api.put(`/users/${id}`, {
       role,
       name
     });

     fetchUsers();

   } catch(err){
     console.error(err);
   }
 };

 const deleteUser = async(id:number)=>{
   try{
     await api.delete(`/users/${id}`);
     fetchUsers();

   }catch(err){
     console.error(err);
   }
 };

 if(loading){
   return (
<div style={{textAlign:"center",marginTop:50}}>
<CircularProgress/>
</div>
   );
 }

 if(error){
   return <Alert severity="error">{error}</Alert>;
 }

 return (
<div>
<Typography variant="h4" gutterBottom>
       User Management
</Typography>

<TableContainer component={Paper}>
<Table>

<TableHead>
<TableRow>
<TableCell>ID</TableCell>
<TableCell>Name</TableCell>
<TableCell>Email</TableCell>
<TableCell>Role</TableCell>
<TableCell>Action</TableCell>
</TableRow>
</TableHead>

<TableBody>

           {users.map((user)=>(
<TableRow key={user.id}>

<TableCell>
                 {user.id}
</TableCell>

<TableCell>
                 {user.name}
</TableCell>

<TableCell>
                 {user.email}
</TableCell>

<TableCell>
<Select
                   size="small"
                   value={user.role}
                   onChange={(e)=>{
                     const newRole = e.target.value;
                     updateRole(
user.id,
                       newRole,
                       user.name
                     );
                   }}
>
<MenuItem value="Admin">
                     Admin
</MenuItem>
<MenuItem value="Manager">
                     Manager
</MenuItem>
<MenuItem value="Employee">
                     Employee
</MenuItem>

</Select>
</TableCell>

<TableCell>
<Button
                   color="error"
                   variant="contained"
                   onClick={()=>deleteUser(user.id)}
>
                   Delete
</Button>
</TableCell>

</TableRow>

           ))}

</TableBody>

</Table>

</TableContainer>

</div>
 );
};

export default UserManagement;