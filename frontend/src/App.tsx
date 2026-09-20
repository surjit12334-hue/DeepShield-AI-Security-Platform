import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { DashboardLayout } from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AnalyzePage from './pages/AnalyzePage';
import AnalysisResultPage from './pages/AnalysisResultPage';
import EvidenceVaultPage from './pages/EvidenceVaultPage';
import HistoryPage from './pages/HistoryPage';
import ThreatIntelligencePage from './pages/ThreatIntelligencePage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
      </Route>
      <Route path="/analyze" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<AnalyzePage />} />
      </Route>
      <Route path="/analysis/:id" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<AnalysisResultPage />} />
      </Route>
      <Route path="/evidence" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<EvidenceVaultPage />} />
      </Route>
      <Route path="/history" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<HistoryPage />} />
      </Route>
      <Route path="/threats" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<ThreatIntelligencePage />} />
      </Route>
      <Route path="/reports" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<ReportsPage />} />
      </Route>
      <Route path="/reports/:id" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<ReportsPage />} />
      </Route>
      <Route path="/settings" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<SettingsPage />} />
      </Route>
      <Route path="/admin" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<AdminPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
