import { useAuthContext } from "@root/hooks/useAuthContext";
import { useFhirContext } from "@root/hooks/useFhirContext";
import type { RouteProps } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

export const PrivateRoute: React.FC<RouteProps> = () => {
  const { isLoggedIn } = useAuthContext();
  const { isFhirLoggedIn } = useFhirContext();
  const navigate = useNavigate();

  if (!isFhirLoggedIn) {
    navigate('/');
  }
  if (isFhirLoggedIn && !isLoggedIn) {
    navigate('/login');
  }
  if (isFhirLoggedIn && isLoggedIn && window.location.pathname === '/') {
    navigate('/order/submit');
  }

  return <Outlet />;
};