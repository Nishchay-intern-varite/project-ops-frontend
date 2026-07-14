const express = require('express');
const cors = require('cors');
const supabase = require('./supabaseClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'projectops_secret';
// ==================== ROOT ====================
app.get('/', function(req, res) {
 res.json({ message: 'Backend Running' });
});
// ==================== AUTH ====================
app.post('/auth/register', async function(req, res) {
 try {
   const { name, email, password } = req.body;
   if (!name || !email || !password) {
     return res.status(400).json({ message: 'All fields are required' });
   }
   const { data: existingUser } = await supabase
     .from('users').select('*').eq('email', email).single();
   if (existingUser) {
     return res.status(400).json({ message: 'User already exists' });
   }
   const hashedPassword = await bcrypt.hash(password, 10);
   const { data, error } = await supabase
     .from('users')
     .insert([{ name, email, password: hashedPassword }])
     .select();
   if (error) return res.status(400).json(error);
   res.status(201).json({ message: 'User registered successfully', user: data });
 } catch (err) {
   res.status(500).json({ message: 'Server Error', error: err.message });
 }
});
app.post('/auth/login', async function(req, res) {
 try {
   const { email, password } = req.body;
   if (!email || !password) {
     return res.status(400).json({ message: 'All fields are required' });
   }
   const { data: user, error } = await supabase
     .from('users').select('*').eq('email', email).single();
   if (error || !user) {
     return res.status(401).json({ message: 'Invalid email or password' });
   }
   const isMatch = await bcrypt.compare(password, user.password);
   if (!isMatch) {
     return res.status(401).json({ message: 'Invalid email or password' });
   }
   const token = jwt.sign(
     { id: user.id, email: user.email, role: user.role },
     JWT_SECRET,
     { expiresIn: '1d' }
   );
   res.json({
     message: 'Login successful',
     token,
     user: { id: user.id, name: user.name, email: user.email, role: user.role }
   });
 } catch (err) {
   res.status(500).json({ message: 'Server Error', error: err.message });
 }
});

// ==================== USERS MANAGEMENT ====================
// Get All Users
app.get('/users', async function(req, res) {
 try {
   const { data, error } = await supabase
     .from('users')
     .select('id, name, email, role');
   if (error) return res.status(400).json(error);
   res.json(data);
 } catch (err) {
   res.status(500).json({
     message: 'Server Error',
     error: err.message
   });
 }
});

// Update User Role
app.put('/users/:id', async function(req, res) {
 try {
   const { id } = req.params;
   const { role, name } = req.body;
   const { data, error } = await supabase
     .from('users')
     .update({
       role,
       name
     })
     .eq('id', id)
     .select();
   if (error) return res.status(400).json(error);
   res.json(data);
 } catch (err) {
   res.status(500).json({
     message: 'Server Error',
     error: err.message
   });
 }
});

// Delete User
app.delete('/users/:id', async function(req, res) {
 try {
   const { id } = req.params;
   const { error } = await supabase
     .from('users')
     .delete()
     .eq('id', id);
   if (error) return res.status(400).json(error);
   res.json({
     message: "User deleted successfully"
   });
 } catch (err) {
   res.status(500).json({
     message: 'Server Error',
     error: err.message
   });
 }
});

// ==================== PROJECTS ====================
app.get('/projects', async function(req, res) {
 try {
   const { data, error } = await supabase.from('projects').select('*');
   if (error) return res.status(400).json(error);
   res.json(data);
 } catch (err) {
   res.status(500).json({ message: 'Server Error', error: err.message });
 }
});
app.post('/projects', async function(req, res) {
try {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Project name is required' });
  }
  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        name,
        description,
        approval_status: "Pending"
      }
    ])
    .select();
  if (error) return res.status(400).json(error);
  res.json(data);
} catch (err) {
  res.status(500).json({
    message: 'Server Error',
    error: err.message
  });
}
});
app.put('/projects/:id', async function(req, res) {
try {
  const { id } = req.params;
  const { name, description, status, approval_status } = req.body;
  const { data, error } = await supabase
    .from('projects')
    .update({
      name,
      description,
      status,
      approval_status
    })
    .eq('id', id)
    .select();
  if (error) return res.status(400).json(error);
  res.json(data);
} catch (err) {
  res.status(500).json({
    message: 'Server Error',
    error: err.message
  });
}
});
app.delete('/projects/:id', async function(req, res) {
 try {
   const { id } = req.params;
   const { error } = await supabase.from('projects').delete().eq('id', id);
   if (error) return res.status(400).json(error);
   res.json({ message: 'Project deleted successfully' });
 } catch (err) {
   res.status(500).json({ message: 'Server Error', error: err.message });
 }
});
// ==================== TASKS ====================
app.get('/tasks', async function(req, res) {
 try {
   const { data, error } = await supabase.from('tasks').select('*');
   if (error) return res.status(400).json(error);
   res.json(data);
 } catch (err) {
   res.status(500).json({ message: 'Server Error', error: err.message });
 }
});
app.post('/tasks', async function(req, res) {
 try {
   const { title, description, status, priority, project_id, due_date } = req.body;
   if (!title) return res.status(400).json({ message: 'Title is required' });
   const { data, error } = await supabase
     .from('tasks')
     .insert([{ title, description, status, priority, project_id, due_date }])
     .select();
   if (error) return res.status(400).json(error);
   res.json(data);
 } catch (err) {
   res.status(500).json({ message: 'Server Error', error: err.message });
 }
});
app.put('/tasks/:id', async function(req, res) {
 try {
   const { id } = req.params;
   const { title, description, status, priority, due_date } = req.body;
   const { data, error } = await supabase
     .from('tasks').update({ title, description, status, priority, due_date }).eq('id', id).select();
   if (error) return res.status(400).json(error);
   res.json(data);
 } catch (err) {
   res.status(500).json({ message: 'Server Error', error: err.message });
 }
});
app.delete('/tasks/:id', async function(req, res) {
 try {
   const { id } = req.params;
   const { error } = await supabase.from('tasks').delete().eq('id', id);
   if (error) return res.status(400).json(error);
   res.json({ message: 'Task deleted successfully' });
 } catch (err) {
   res.status(500).json({ message: 'Server Error', error: err.message });
 }
});
// ==================== RESOURCES ====================
// Get All Resources
app.get('/resources', async function (req, res) {
 try {
   const { data, error } = await supabase
     .from('resources')
     .select('*')
     .order('id', { ascending: true });
   if (error) return res.status(400).json(error);
   res.json(data);
 } catch (err) {
   res.status(500).json({
     message: 'Server Error',
     error: err.message,
   });
 }
});
// Add Resource
app.post('/resources', async function (req, res) {
 try {
   const { name, role, project, email, phone } = req.body;
   if (!name || !role) {
     return res.status(400).json({
       message: 'Name and Role are required',
     });
   }
   const { data, error } = await supabase
     .from('resources')
     .insert([
       {
         name,
         role,
         project,
         email,
         phone,
       },
     ])
     .select();
   if (error) return res.status(400).json(error);
   res.json(data);
 } catch (err) {
   res.status(500).json({
     message: 'Server Error',
     error: err.message,
   });
 }
});
// Update Resource
app.put('/resources/:id', async function (req, res) {
 try {
   const { id } = req.params;
   const { name, role, project, email, phone } = req.body;
   const { data, error } = await supabase
     .from('resources')
     .update({
       name,
       role,
       project,
       email,
       phone,
     })
     .eq('id', id)
     .select();
   if (error) return res.status(400).json(error);
   res.json(data);
 } catch (err) {
   res.status(500).json({
     message: 'Server Error',
     error: err.message,
   });
 }
});
// Delete Resource
app.delete('/resources/:id', async function (req, res) {
 try {
   const { id } = req.params;
   const { error } = await supabase
     .from('resources')
     .delete()
     .eq('id', id);
   if (error) return res.status(400).json(error);
   res.json({
     message: 'Resource deleted successfully',
   });
 } catch (err) {
   res.status(500).json({
     message: 'Server Error',
     error: err.message,
   });
 }
});
// ==================== TIMESHEETS ====================
// Get All Timesheets
app.get('/timesheets', async function (req, res) {
 try {
   const { data, error } = await supabase
     .from('timesheets')
     .select('*')
     .order('id', { ascending: true });
   if (error) return res.status(400).json(error);
   res.json(data);
 } catch (err) {
   res.status(500).json({
     message: 'Server Error',
     error: err.message,
   });
 }
});
// Add Timesheet
app.post('/timesheets', async function (req, res) {
 try {
   const {
     employee_name,
     project,
     task,
     hours,
     work_date,
   } = req.body;
   if (!employee_name || !project || !task || !hours || !work_date) {
     return res.status(400).json({
       message: 'All fields are required',
     });
   }
   const { data, error } = await supabase
     .from('timesheets')
     .insert([
       {
         employee_name,
         project,
         task,
         hours,
         work_date,
       },
     ])
     .select();
   if (error) return res.status(400).json(error);
   res.json(data);
 } catch (err) {
   res.status(500).json({
     message: 'Server Error',
     error: err.message,
   });
 }
});
// Update Timesheet
app.put('/timesheets/:id', async function (req, res) {
 try {
   const { id } = req.params;
   const {
     employee_name,
     project,
     task,
     hours,
     work_date,
   } = req.body;
   const { data, error } = await supabase
     .from('timesheets')
     .update({
       employee_name,
       project,
       task,
       hours,
       work_date,
     })
     .eq('id', id)
     .select();
   if (error) return res.status(400).json(error);
   res.json(data);
 } catch (err) {
   res.status(500).json({
     message: 'Server Error',
     error: err.message,
   });
 }
});
// Delete Timesheet
app.delete('/timesheets/:id', async function (req, res) {
 try {
   const { id } = req.params;
   const { error } = await supabase
     .from('timesheets')
     .delete()
     .eq('id', id);
   if (error) return res.status(400).json(error);
   res.json({
     message: 'Timesheet deleted successfully',
   });
 } catch (err) {
   res.status(500).json({
     message: 'Server Error',
     error: err.message,
   });
 }
});

// ==================== ALLOCATIONS ====================
// Get All Allocations
app.get('/allocations', async function (req, res) {
 try {
   const { data, error } = await supabase
     .from('allocations')
     .select('*')
     .order('id', { ascending: true });
   if (error) return res.status(400).json(error);
   res.json(data);
 } catch (err) {
   res.status(500).json({
     message: 'Server Error',
     error: err.message,
   });
 }
});

// Add Allocation
app.post('/allocations', async function (req, res) {
 try {
   const {
     project_id,
     resource_id,
     start_date,
     end_date,
     allocation_percentage,
     status
   } = req.body;

   if (!project_id || !resource_id || !start_date || !allocation_percentage || !status) {
     return res.status(400).json({
       message: 'Required fields missing'
     });
   }

   const { data, error } = await supabase
     .from('allocations')
     .insert([
       {
         project_id,
         resource_id,
         start_date,
         end_date,
         allocation_percentage,
         status
       }
     ])
     .select();

   if (error) return res.status(400).json(error);
   res.json(data);
 } catch (err) {
   res.status(500).json({
     message: 'Server Error',
     error: err.message,
   });
 }
});

// Update Allocation
app.put('/allocations/:id', async function (req, res) {
 try {
   const { id } = req.params;
   const {
     project_id,
     resource_id,
     start_date,
     end_date,
     allocation_percentage,
     status
   } = req.body;

   const { data, error } = await supabase
     .from('allocations')
     .update({
       project_id,
       resource_id,
       start_date,
       end_date,
       allocation_percentage,
       status
     })
     .eq('id', id)
     .select();

   if (error) return res.status(400).json(error);
   res.json(data);

 } catch (err) {
   res.status(500).json({
     message:'Server Error',
     error: err.message
   });
 }
});

// Delete Allocation
app.delete('/allocations/:id', async function (req,res){
 try {
   const { id } = req.params;

   const { error } = await supabase
     .from('allocations')
     .delete()
     .eq('id', id);

   if(error) return res.status(400).json(error);

   res.json({
     message:'Allocation deleted successfully'
   });

 } catch(err){
   res.status(500).json({
     message:'Server Error',
     error:err.message
   });
 }
});

// ==================== DASHBOARD ====================
app.get('/dashboard', async (req, res) => {
 try {
   const { data: projects } = await supabase.from('projects').select('*');
   const { data: tasks } = await supabase.from('tasks').select('*');
   const { data: resources } = await supabase.from('resources').select('*');
   const { data: timesheets } = await supabase.from('timesheets').select('*');
   res.json({
     totalProjects: projects?.length || 0,
     pendingProjects:
       projects?.filter(p => p.status === 'Pending').length || 0,
     inProgressProjects:
       projects?.filter(p => p.status === 'In Progress').length || 0,
     completedProjects:
       projects?.filter(p => p.status === 'Completed').length || 0,
     totalTasks: tasks?.length || 0,
     totalResources: resources?.length || 0,
     totalTimesheets: timesheets?.length || 0,
     recentProjects: projects?.slice(-5).reverse() || [],
   });
 } catch (err) {
   res.status(500).json({
     message: 'Server Error',
     error: err.message,
   });
 }
});
// ==================== SERVER ====================
app.listen(PORT, function() {
 console.log('Backend running on port ' + PORT);
});