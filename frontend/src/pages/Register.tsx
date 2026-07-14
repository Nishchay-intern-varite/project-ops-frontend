import { useState } from "react";
import {
 Container,
 Paper,
 Typography,
 TextField,
 Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
function Register() {
 const navigate = useNavigate();
 const [form, setForm] = useState({
   name: "",
   email: "",
   password: "",
 });
 const handleRegister = async () => {
   try {
     await api.post("/auth/register", form);
     alert("Registration successful!");
     navigate("/login");
   } catch (err: any) {
     alert(err?.response?.data?.message || "Registration Failed");
   }
 };
 return (
<Container maxWidth="sm" sx={{ mt: 10 }}>
<Paper elevation={3} sx={{ p: 4 }}>
<Typography
         variant="h4"
         align="center"
         sx={{ mb: 3 }}
>
         Register
</Typography>
<TextField
         fullWidth
         label="Name"
         margin="normal"
         value={form.name}
         onChange={(e) =>
           setForm({ ...form, name: e.target.value })
         }
       />
<TextField
         fullWidth
         label="Email"
         type="email"
         margin="normal"
         value={form.email}
         onChange={(e) =>
           setForm({ ...form, email: e.target.value })
         }
       />
<TextField
         fullWidth
         label="Password"
         type="password"
         margin="normal"
         value={form.password}
         onChange={(e) =>
           setForm({ ...form, password: e.target.value })
         }
       />
<Button
         fullWidth
         variant="contained"
         sx={{ mt: 2 }}
         onClick={handleRegister}
>
         Register
</Button>
<Button
         fullWidth
         variant="text"
         sx={{ mt: 1 }}
         onClick={() => navigate("/login")}
>
         Already have an account? Login
</Button>
</Paper>
</Container>
 );
}
export default Register;