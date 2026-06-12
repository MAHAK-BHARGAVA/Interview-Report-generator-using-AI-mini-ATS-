import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Protected = () => {
  const { loading, user } = useAuth();

  // 1. Show a loader while checking if the user is authenticated
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // 2. If no user is logged in, redirect them immediately to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If authenticated, render the child routes safely
  return <Outlet />;
};

export default Protected;