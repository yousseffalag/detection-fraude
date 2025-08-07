import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';
import NotFoundPage from '../pages/NotFound';
import LoginPage from '../pages/guest/login';
import RegisterPage from '../pages/guest/signup';


const AppRoutes = () => (
    <Routes>

        <Route path="/login" element={
            <LoginPage />
        } />

        <Route path="/signup" element={
            <RegisterPage />
        } />

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