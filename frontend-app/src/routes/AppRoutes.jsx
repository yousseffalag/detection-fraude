import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';
import GuestLayout from '../layouts/GuestLayout';
import NotFoundPage from '../pages/NotFound';
import LoginPage from '../pages/guest/login';
import RegisterPage from '../pages/guest/signup';
import HomePage from '../pages/guest/home';
import AdminDashboard from '../pages/admin/dashboard';
import Users from "../pages/admin/users"
import Transactions from '../pages/admin/transactions';
import AdminSettingsPage from "../pages/admin/settings"
import AIModelsAdmin from "../pages/admin/modeleAI"
import FraudDetectionApp from "../pages/user/transactionPrediction"
import FraudCSVAnalysis from "../pages/user/transactionsCSV"
import UsersStatic from '../pages/admin/usersStatic';
import TransactionsUser from '../pages/user/transactionsHistory';
import UserProfilePage from '../pages/user/profile';
import UserDashboard from "../pages/user/dashboard";


const AppRoutes = () => (
    <Routes>

        <Route element={<GuestLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<RegisterPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/" element={<HomePage />} />
        </Route>

        <Route element={<AdminLayout />}>
            <Route path="/admin/userStatic" element={<UsersStatic />} />
        </Route>

        <Route
            path="/"
            element={
                <ProtectedRoute role="user">
                    <UserLayout />
                </ProtectedRoute>
            }
        >
            <Route path="prediction" element={<FraudDetectionApp />} />
            <Route path="predictionCSV" element={<FraudCSVAnalysis />} /> 
            <Route path="transactionsHistory" element={<TransactionsUser />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="dashboard" element={<UserDashboard />} />

        </Route>


        <Route
            path="/admin"
            element={
                <ProtectedRoute role="admin">
                    <AdminLayout />
                </ProtectedRoute>
            }
        >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="modelAI" element={<AIModelsAdmin />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
    </Routes>
);

export default AppRoutes;