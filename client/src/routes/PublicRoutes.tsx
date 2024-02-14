import { AuthContext } from "@root/providers/AuthProvider";
import { useContext } from 'react';
import type { RouteProps } from 'react-router-dom';
import { Navigate, Outlet } from 'react-router-dom';

export const PublicRoute: React.FC<RouteProps> = () => {
  const { isLoggedIn } = useContext(AuthContext);

  // Immediately navigate to dashboard if authenticated
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};