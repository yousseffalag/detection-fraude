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


const AppRoutes = () => (
    <Routes>

        <Route element={<GuestLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<RegisterPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/" element={<HomePage />} />
        </Route>

        <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/transactions" element={<Transactions />} />
            <Route path="/admin/settings" element={<AdminSettingsPage/>} />
            <Route path="/admin/modelAI" element={<AIModelsAdmin />} />
            <Route path="/admin/Prediction" element={<FraudDetectionApp />} />
            <Route path="/admin/PredictionCSV" element={<FraudCSVAnalysis />} />
        </Route>

        <Route
            path="/"
            element={
                <ProtectedRoute role="user">
                    <UserLayout />
                </ProtectedRoute>
            }
        >
        </Route>


        <Route
            path="/admin"
            element={
                <ProtectedRoute role="admin">
                    <AdminLayout />
                </ProtectedRoute>
            }
        >
        </Route>

        <Route path="*" element={<NotFoundPage />} />
    </Routes>
);

export default AppRoutes;