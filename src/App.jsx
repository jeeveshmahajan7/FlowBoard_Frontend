import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";

import Login from "../src/pages/auth/Login";
import Signup from "../src/pages/auth/Signup";
import Dashboard from "../src/pages/dashboard/Dashboard";
import Projects from "../src/pages/projects/Projects";
import Tasks from "../src/pages/tasks/Tasks";
import Teams from "../src/pages/teams/Teams";
import ProjectDetails from "./pages/projects/ProjectDetails";
import TaskDetails from "./pages/tasks/TaskDetails";
import TeamDetails from "./pages/teams/TeamDetails";
import Settings from "./pages/settings/Settings";

function App() {
  return (
    <Routes>
      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Private routes */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/projects/:projectId" element={<ProjectDetails />} />
        <Route path="/tasks/:taskId" element={<TaskDetails />} />
        <Route path="/teams/:teamId" element={<TeamDetails />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
