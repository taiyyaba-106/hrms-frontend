import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import { PERMISSIONS } from './utils/rbac';

// Pages
import LoginPage from './pages/LoginPage';
import AccountActivationPage from './pages/AccountActivationPage';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import OrganizationPage from './pages/OrganizationPage';
import AttendancePage from './pages/AttendancePage';
import TimesheetsPage from './pages/TimesheetsPage';
import LeavePage from './pages/LeavePage';
import PayrollPage from './pages/PayrollPage';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/UsersPage';
import RolesPermissionsPage from './pages/RolesPermissionsPage';
import DesignSystemDemo from './pages/DesignSystemDemo';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/activate" element={<AccountActivationPage />} />
        <Route path="/demo" element={<DesignSystemDemo />} />

        {/* Authenticated Application Layout Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/employees"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.EMPLOYEE_VIEW}>
                <EmployeesPage />
              </ProtectedRoute>
            }
          />
          <Route path="/organization" element={<OrganizationPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/timesheets" element={<TimesheetsPage />} />
          <Route path="/leave" element={<LeavePage />} />
          <Route
            path="/payroll"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.SALARY_MANAGE}>
                <PayrollPage />
              </ProtectedRoute>
            }
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/users"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.EMPLOYEE_CREATE}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles-permissions"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.ROLE_MANAGE}>
                <RolesPermissionsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
