import { useAuthContext } from "@root/hooks/useAuthContext";
import { useFhirContext } from "@root/hooks/useFhirContext";
import { useEffect } from "react";
import type { RouteProps } from 'react-router-dom';
import { Outlet, useNavigate } from 'react-router-dom';

export const PublicRoute: React.FC<RouteProps> = () => {
  const { isFhirLoggedIn } = useFhirContext();
  const { isLoggedIn } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/order/submit');
    }
    if (isFhirLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, isFhirLoggedIn, navigate]);

  return <Outlet />;
};