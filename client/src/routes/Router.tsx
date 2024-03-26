import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoutes';
import { PublicRoute } from './PublicRoutes';
import LoginPage from '@root/pages/LoginPage';
import HomePage from '@root/pages/HomePage';  
import OrderSubmissionPage from '@root/pages/Order/OrderSubmissionPage';
import OrderListPage from '@root/pages/Order/OrderListPage';
import OrderViewPage from '@root/pages/Order/OrderViewPage';
import CalendarPage from '@root/pages/Reservation/Calendar/CalendarPage';
import ReservationDetailPage from '@root/pages/Reservation/Detail/ReservationDetailPage';
import ReservationSubmitPage from '@root/pages/Reservation/Submit/ReservationSubmitPage';
import OrderConfirmPage from '@root/pages/Order/OrderConfirmPage';
import SplashPage from '@root/pages/SplashPage';

export default function GlobalRouter() {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path='/' element={<HomePage />} />
        <Route path="/splash" element={<SplashPage />} />
        <Route path='/order/submit' element={<OrderSubmissionPage />} />
        <Route path='/order/list' element={<OrderListPage />} />
        <Route path='/order/view/:orderId' element={<OrderViewPage />} />
        <Route path='/order/confirm' element={<OrderConfirmPage />} />
        <Route path='/reservation/calendar' element={<CalendarPage />} />
        <Route path='/reservation/detail' element={<ReservationDetailPage />} />
        <Route path='/reservation/submit' element={<ReservationSubmitPage />} />
      </Route>
      <Route element={<PublicRoute />}>
        <Route path='/login' element={<LoginPage />} />
      </Route>
    </Routes>
  );
}
