import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/Layout/DashboardLayout';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import TalentosListado from './pages/talentos/TalentosListado';
import TalentoFormulario from './pages/talentos/TalentoFormulario';
import TalentoDetalle from './pages/talentos/TalentoDetalle';
import CargarCV from './pages/talentos/CargarCV';
import EmpresasListado from './pages/empresas/EmpresasListado';
import EmpresaFormulario from './pages/empresas/EmpresaFormulario';
import EmpresaDetalle from './pages/empresas/EmpresaDetalle';
import ReclutadoresListado from './pages/reclutadores/ReclutadoresListado';
import ReclutadorFormulario from './pages/reclutadores/ReclutadorFormulario';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<ProtectedRoute><DashboardLayout><Navigate to="/dashboard" replace /></DashboardLayout></ProtectedRoute>} />
          
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><DashboardLayout><Profile /></DashboardLayout></ProtectedRoute>} />
          
          {/* Talentos */}
          <Route path="/talentos" element={<ProtectedRoute><DashboardLayout><TalentosListado /></DashboardLayout></ProtectedRoute>} />
          <Route path="/talentos/nuevo" element={<ProtectedRoute><DashboardLayout><TalentoFormulario /></DashboardLayout></ProtectedRoute>} />
          <Route path="/talentos/cargar-cv" element={<ProtectedRoute><DashboardLayout><CargarCV /></DashboardLayout></ProtectedRoute>} />
          <Route path="/talentos/:id" element={<ProtectedRoute><DashboardLayout><TalentoDetalle /></DashboardLayout></ProtectedRoute>} />
          <Route path="/talentos/:id/editar" element={<ProtectedRoute><DashboardLayout><TalentoFormulario /></DashboardLayout></ProtectedRoute>} />

          {/* Empresas */}
          <Route path="/empresas" element={<ProtectedRoute><DashboardLayout><EmpresasListado /></DashboardLayout></ProtectedRoute>} />
          <Route path="/empresas/nueva" element={<ProtectedRoute roles={['Administrador']}><DashboardLayout><EmpresaFormulario /></DashboardLayout></ProtectedRoute>} />
          <Route path="/empresas/:id" element={<ProtectedRoute><DashboardLayout><EmpresaDetalle /></DashboardLayout></ProtectedRoute>} />
          <Route path="/empresas/:id/editar" element={<ProtectedRoute roles={['Administrador']}><DashboardLayout><EmpresaFormulario /></DashboardLayout></ProtectedRoute>} />

          {/* Reclutadores */}
          <Route path="/reclutadores" element={<ProtectedRoute roles={['Administrador']}><DashboardLayout><ReclutadoresListado /></DashboardLayout></ProtectedRoute>} />
          <Route path="/reclutadores/nuevo" element={<ProtectedRoute roles={['Administrador']}><DashboardLayout><ReclutadorFormulario /></DashboardLayout></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
