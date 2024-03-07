import { useAuthContext } from "@root/hooks/useAuthContext";
import { useFhirContext } from "@root/hooks/useFhirContext";
import type { RouteProps } from 'react-router-dom';
import { Outlet, useNavigate } from 'react-router-dom';

export const PublicRoute: React.FC<RouteProps> = () => {
  const { isFhirLoggedIn } = useFhirContext();
  const { isLoggedIn } = useAuthContext();
  const navigate = useNavigate();

  if (isLoggedIn) {
    navigate('/order/submit');
  }
  if (isFhirLoggedIn) {
    navigate('/login');
  }

  return <Outlet />;
};