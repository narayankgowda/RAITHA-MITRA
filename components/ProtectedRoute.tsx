
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('farmer' | 'admin' | 'buyer')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their specific dashboard if they try to access a route they aren't allowed to
        if (user.role === 'farmer') return <Navigate to="/farmer" replace />;
        if (user.role === 'buyer') return <Navigate to="/buyer" replace />;
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
