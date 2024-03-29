import type { RouteProps } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

export const PublicRoute: React.FC<RouteProps> = () => {
  return <Outlet />;
};