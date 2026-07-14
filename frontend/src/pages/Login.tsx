import { useState } from 'react';
import { Container, Paper, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
function Login() {
 const navigate = useNavigate();
 const [form, setForm] = useState({
   email: '',
   password: ''
 });
 const handleLogin = async () => {
   try {
     const res = await api.post('/auth/login', form);
     localStorage.setItem('token', res.data.token);
     localStorage.setItem('user', JSON.stringify(res.data.user));
     navigate('/');
   } catch (err: any) {
     alert(err.response?.data?.message || 'Login Failed');
   }
 };
 return (
<Container maxWidth="sm" sx={{ mt: 10 }}>
<Paper sx={{ p: 4 }}>
<Typography
 variant="h4"
 align="center"
 sx={{ mb: 3 }}
>
         Login
</Typography>
<TextField
         fullWidth
         label="Email"
         margin="normal"
         value={form.email}
         onChange={(e) => setForm({ ...form, email: e.target.value })}
       />
<TextField
         fullWidth
         type="password"
         label="Password"
         margin="normal"
         value={form.password}
         onChange={(e) => setForm({ ...form, password: e.target.value })}
       />
<Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleLogin}>
         Login
</Button>
</Paper>
</Container>
 );
}
export default Login;