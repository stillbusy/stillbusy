import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Chores from "./pages/Chores";
import Shopping from "./pages/Shopping";
import Emergency from "./pages/Emergency";
import SurvivalMode from "./pages/SurvivalMode";
import GroupSettings from "./pages/GroupSettings";
import JoinGroup from "./pages/JoinGroup";
import Profile from "./pages/Profile";
import { AuthProvider, useAuth } from "./context/AuthContext";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (!user.groupId && window.location.pathname !== "/join-group") return <Navigate to="/join-group" />;
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/join-group" element={<ProtectedRoute><JoinGroup /></ProtectedRoute>} />
      
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/expenses" element={<ProtectedRoute><Layout><Expenses /></Layout></ProtectedRoute>} />
      <Route path="/chores" element={<ProtectedRoute><Layout><Chores /></Layout></ProtectedRoute>} />
      <Route path="/shopping" element={<ProtectedRoute><Layout><Shopping /></Layout></ProtectedRoute>} />
      <Route path="/emergency" element={<ProtectedRoute><Layout><Emergency /></Layout></ProtectedRoute>} />
      <Route path="/survival" element={<ProtectedRoute><Layout><SurvivalMode /></Layout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Layout><GroupSettings /></Layout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
