import { Routes, Route } from 'react-router';
import { PrivateRoute } from './PrivateRoutes';
import { PublicRoute } from './PublicRoutes';
import LoginPage from '@root/pages/LoginPage';
import HomePage from '@root/pages/HomePage';
import OrderSubmissionPage from '@root/pages/Order/OrderSubmissionPage';
import OrderListPage from '@root/pages/Order/OrderListPage';
import OrderViewPage from '@root/pages/Order/OrderViewPage';

export default function GlobalRouter() {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/order/submit' element={<OrderSubmissionPage />} />
        <Route path='/order/list' element={<OrderListPage />} />
        <Route path='/order/view/:orderId' element={<OrderViewPage />} />
      </Route>
      <Route element={<PublicRoute />}>
        <Route path='/login' element={<LoginPage />} />
      </Route>
    </Routes>
  );
}
