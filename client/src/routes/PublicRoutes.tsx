import { useAuthContext } from "@root/hooks/useAuthContext";
import { useFhirContext } from "@root/hooks/useFhirContext";
import type { RouteProps } from 'react-router-dom';
import { Navigate, Outlet } from 'react-router-dom';

export const PublicRoute: React.FC<RouteProps> = () => {
  const { isFhirLoggedIn } = useFhirContext();
  const { isLoggedIn } = useAuthContext();

  if (!isFhirLoggedIn) {
    return <Navigate to="/" replace />;
  }
  if (isFhirLoggedIn && isLoggedIn && window.location.pathname === '/login') {  
    return <Navigate to="/order/submit" replace />;
  }

  return <Outlet />;
};