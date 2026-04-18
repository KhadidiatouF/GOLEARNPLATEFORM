import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Formations from './pages/Formations';
import FormationDetail from './pages/FormationDetail';
import Paiement from './pages/Paiement';
import AdminDashboard from './pages/AdminDashboard';
import ProfDashboard from './pages/ProfDashboard';
import ApprenantDashboard from './pages/ApprenantDashboard';
import DemandeFormateur from './pages/DemandeFormateur';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/formations" element={<Formations />} />
          <Route path="/formations/:id" element={<FormationDetail />} />
          <Route path="/paiement" element={<Paiement />} />
          <Route path="/demande-formateur" element={<DemandeFormateur />} />
          
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
