import { useState, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CompaniesPage = lazy(() => import('./pages/CompaniesPage'));
const AddCompanyPage = lazy(() => import('./pages/AddCompanyPage'));
const LogsPage = lazy(() => import('./pages/LogsPage'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('admin_token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading...</div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/companies" element={<ProtectedRoute><DashboardLayout><CompaniesPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/companies/add" element={<ProtectedRoute><DashboardLayout><AddCompanyPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/companies/:id/edit" element={<ProtectedRoute><DashboardLayout><AddCompanyPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/logs" element={<ProtectedRoute><DashboardLayout><LogsPage /></DashboardLayout></ProtectedRoute>} />
      </Routes>
    </Suspense>
  );
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const user = JSON.parse(localStorage.getItem('admin_user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/login';
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: '📊' },
    { label: 'Companies', path: '/companies', icon: '🏢' },
    { label: 'Add Company', path: '/companies/add', icon: '➕' },
    { label: 'Collection Logs', path: '/logs', icon: '📋' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: sidebarOpen ? '240px' : '64px',
        background: '#0f172a',
        color: 'white',
        padding: '1rem',
        transition: 'width 0.2s',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '2rem', whiteSpace: 'nowrap', overflow: 'hidden' }}>
          {sidebarOpen ? 'InternAPI Admin' : 'IA'}
        </h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.625rem 0.75rem', borderRadius: '0.375rem',
                color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem',
                transition: 'background 0.15s',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#1e293b'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </a>
          ))}
        </nav>
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
          <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden' }}>
            {sidebarOpen && user.name}
          </div>
          <button onClick={handleLogout} style={{
            background: 'none', border: '1px solid #334155', color: '#94a3b8',
            padding: '0.375rem 0.75rem', borderRadius: '0.25rem', cursor: 'pointer',
            fontSize: '0.8125rem', width: '100%',
          }}>
            {sidebarOpen ? 'Logout' : '✕'}
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, background: '#f8fafc', overflow: 'auto' }}>
        <div style={{ padding: '1.5rem 2rem' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
