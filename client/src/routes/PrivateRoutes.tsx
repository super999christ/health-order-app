import { AuthContext } from "@root/providers/AuthProvider";
import { useContext } from 'react';
import type { RouteProps } from 'react-router-dom';
import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRoute: React.FC<RouteProps> = () => {
  const { isLoggedIn } = useContext(AuthContext);

  // Immediately navigate to login if not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};