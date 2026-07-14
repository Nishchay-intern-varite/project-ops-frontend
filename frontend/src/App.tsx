import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Resources from "./pages/Resources";
import Timesheets from "./pages/Timesheets";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import UserManagement from "./pages/UserManagement";
import ResourceAllocation from "./pages/ResourceAllocation";
function App() {
 return (
<BrowserRouter>
<Routes>
       {/* Public Routes */}
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
       {/* Dashboard */}
<Route
         path="/"
         element={
<ProtectedRoute>
<MainLayout>
<Dashboard />
</MainLayout>
</ProtectedRoute>
         }
       />
       {/* Projects */}
<Route
         path="/projects"
         element={
<ProtectedRoute>
<MainLayout>
<Projects />
</MainLayout>
</ProtectedRoute>
         }
       />
       {/* Tasks */}
<Route
         path="/tasks"
         element={
<ProtectedRoute>
<MainLayout>
<Tasks />
</MainLayout>
</ProtectedRoute>
         }
       />
       {/* Resources */}
<Route
         path="/resources"
         element={
<ProtectedRoute>
<MainLayout>
<Resources />
</MainLayout>
</ProtectedRoute>
         }
       />
       {/* Resource Allocation */}
<Route
         path="/allocations"
         element={
<ProtectedRoute>
<MainLayout>
<ResourceAllocation />
</MainLayout>
</ProtectedRoute>
         }
       />
       {/* Timesheets */}
<Route
         path="/timesheets"
         element={
<ProtectedRoute>
<MainLayout>
<Timesheets />
</MainLayout>
</ProtectedRoute>
         }
       />
       {/* Reports */}
<Route
         path="/reports"
         element={
<ProtectedRoute>
<MainLayout>
<Reports />
</MainLayout>
</ProtectedRoute>
         }
       />
       {/* User Management */}
<Route
         path="/users"
         element={
<ProtectedRoute>
<MainLayout>
<UserManagement />
</MainLayout>
</ProtectedRoute>
         }
       />
       {/* Settings */}
<Route
         path="/settings"
         element={
<ProtectedRoute>
<MainLayout>
<Settings />
</MainLayout>
</ProtectedRoute>
         }
       />
</Routes>
</BrowserRouter>
 );
}
export default App;