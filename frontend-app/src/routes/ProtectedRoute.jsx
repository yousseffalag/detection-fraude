import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { Loader } from 'lucide-react';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
        <div className="flex flex-col items-center">
          <Loader className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (!user && !loading) {
    console.log("User : ", user)
    console.log("No user found, redirecting to login.");
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    console.log("user.role : ", user.role);
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
