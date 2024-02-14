import { Routes, Route } from 'react-router';
import { PrivateRoute } from './PrivateRoutes';
import { PublicRoute } from './PublicRoutes';
import DashboardPage from '@root/pages/DashboardPage';
import LoginPage from '@root/pages/LoginPage';

export default function GlobalRouter() {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path='/dashboard' element={<DashboardPage />} />
      </Route>
      <Route element={<PublicRoute />}>
        <Route path='/' element={<LoginPage />} />
        <Route path='/login' element={<LoginPage />} />
      </Route>
    </Routes>
  );
}
