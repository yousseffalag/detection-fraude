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


const AppRoutes = () => (
    <Routes>

        <Route element={<GuestLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<RegisterPage />} />
            <Route path="/home" element={<HomePage />} />
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