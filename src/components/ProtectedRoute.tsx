import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingState } from '@/components/ui/loading-state';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/merchant/login',
}) => {
  const { user, loading, userRole, isAdmin, isMerchant } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingState isLoading={true} type="text" count={5} />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If role is required, check if user has the role
  if (requiredRole) {
    // Check for admin role
    if (requiredRole === 'admin' && !isAdmin) {
      return <Navigate to="/unauthorized" replace />;
    }

    // Check for merchant role
    if (requiredRole === 'merchant' && !isMerchant) {
      return <Navigate to="/unauthorized" replace />;
    }

    // Check for any other role
    if (requiredRole !== 'admin' && requiredRole !== 'merchant' && userRole !== requiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If authenticated and has required role, render children
  return <>{children}</>;
};

export default ProtectedRoute;
