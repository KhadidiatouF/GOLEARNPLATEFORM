import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Formations from './pages/Formations';
import AdminDashboard from './pages/AdminDashboard';
import ProfDashboard from './pages/ProfDashboard';
import ApprenantDashboard from './pages/ApprenantDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/formations" element={<Formations />} />
          
          {/* Routes protégées par profil */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/prof" 
            element={
              <ProtectedRoute allowedRoles={['prof', 'admin']}>
                <ProfDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/apprenant" 
            element={
              <ProtectedRoute allowedRoles={['apprenant', 'admin']}>
                <ApprenantDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
