import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { ProtectedRoute } from './ProtectedRoute';

// Public pages
import Landing from '../pages/public/Landing';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import ForgotPassword from '../pages/public/ForgotPassword';
import ResetPassword from '../pages/public/ResetPassword';
import VerifyEmail from '../pages/public/VerifyEmail';
import Contact from '../pages/public/Contact';
import AboutUs from '../pages/public/AboutUs';

// Protected pages
import AdminDashboard from '../pages/protected/AdminDashboard';
import AdminCompanies from '../pages/protected/AdminCompanies';
import AdminAnalytics from '../pages/protected/AdminAnalytics';
import AdminSubscriptionsPage from '../pages/protected/AdminSubscriptionsPage';
import AdminPricingPage from '../pages/protected/AdminPricingPage';
import AdminSettingsPage from '../pages/protected/AdminSettingsPage';
import ManagerDashboard from '../pages/protected/ManagerDashboard';
import ManagerUsersPage from '../pages/protected/ManagerUsersPage';
import RolesPage from '../pages/protected/RolesPage';
import ManagerTasksPage from '../pages/protected/ManagerTasksPage';
import ManagerCalendarPage from '../pages/protected/ManagerCalendarPage';
import ManagerChatPage from '../pages/protected/ManagerChatPage';
import SettingsPage from '../pages/protected/SettingsPage';
import UserDashboard from '../pages/protected/UserDashboard';
import UserChatPage from '../components/UserChatPage';
import MeetingPage from '../pages/protected/MeetingPage.jsx';

const PublicRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();
    if (isAuthenticated && user) {
        if (user.role === 'admin') {
            return <Navigate to="/admin" replace />;
        } else if (user.role === 'manager') {
            return <Navigate to="/manager" replace />;
        } else if (user.role === 'user') {
            return <Navigate to="/user" replace />;
        }
    }
    return children;
};

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                {/* PUBLIC ROUTES */}
                <Route
                    path="/"
                    element={
                        <PublicRoute>
                            <Landing />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    }
                />

                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />

                <Route
                    path="/contact"
                    element={
                        <PublicRoute>
                            <Contact />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/about"
                    element={
                        <PublicRoute>
                            <AboutUs />
                        </PublicRoute>
                    }
                />

                {/* ADMIN ROUTES */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/companies"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminCompanies />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/analytics"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminAnalytics />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/subscriptions"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminSubscriptionsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/pricing"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminPricingPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/settings"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminSettingsPage />
                        </ProtectedRoute>
                    }
                />

                {/* MANAGER ROUTES */}
                <Route
                    path="/manager"
                    element={
                        <ProtectedRoute requiredRole="manager">
                            <ManagerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/manager/users"
                    element={
                        <ProtectedRoute requiredRole="manager">
                            <ManagerUsersPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/manager/roles"
                    element={
                        <ProtectedRoute requiredRole="manager">
                            <RolesPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/manager/calendar"
                    element={
                        <ProtectedRoute requiredRole="manager">
                            <ManagerCalendarPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/manager/tasks"
                    element={
                        <ProtectedRoute requiredRole="manager">
                            <ManagerTasksPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/manager/chat"
                    element={
                        <ProtectedRoute requiredRole="manager">
                            <ManagerChatPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/manager/settings"
                    element={
                        <ProtectedRoute requiredRole="manager">
                            <SettingsPage />
                        </ProtectedRoute>
                    }
                />

                {/* USER ROUTES */}
                <Route
                    path="/user"
                    element={
                        <ProtectedRoute requiredRole="user">
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/chat"
                    element={
                        <ProtectedRoute requiredRole="user">
                            <UserChatPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="/meeting/:meetingId" element={<MeetingPage />} />

                {/* 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}