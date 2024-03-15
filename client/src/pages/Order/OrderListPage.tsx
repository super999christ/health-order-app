import { faPlus, faSearch } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getOrdersByPatient } from '@root/apis/orders';
import LogoIcon from '@root/assets/images/logo.png';
import { LogoutButton } from '@root/components/LogoutButton';
import Environment from '@root/constants/base';
import { useFhirContext } from '@root/hooks/useFhirContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

export default function OrderListPage() {
  const navigate = useNavigate();
  const { patient } = useFhirContext();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const PatientID = patient?.id as string;
    if (PatientID) {
      getOrdersByPatient({ PatientID, EpicIDNumber: Environment.EPIC_ID_NUMBER })
        .then(res => {
          setOrders(res);
        })
        .catch(err => {
          console.log("Error while getting orders: ", { PatientID }, err);
        });
    }
  }, [patient]);

  const onNewOrder = () => {
    navigate('/order/submit');
  };

  // const mockOrders = [
  //   {
  //     name: 'Giacomo Guilizzon',
  //     visit: 'CSN3245',
  //     status: 'OPEN',
  //     orderId: '324323',
  //     equipment: 'Lazer Box',
  //     lastUpdated: 'Last Updated'
  //   },
  //   {
  //     name: 'Giacomo Guilizzon',
  //     visit: 'CSN3245',
  //     status: 'CLOSED',
  //     orderId: '123456',
  //     equipment: 'Lazer Box',
  //     lastUpdated: 'Last Updated'
  //   },
  //   {
  //     name: 'Giacomo Guilizzon',
  //     visit: 'CSN3245',
  //     status: 'OPEN',
  //     orderId: '123589',
  //     equipment: 'Lazer Box',
  //     lastUpdated: 'Last Updated'
  //   },
  // ];

  const onCancelOrder = () => {
    if (confirm("Are you sure you want to cancel this order?")) {
      // TODO: Call API to cancel the order
    }
  }

  return (
    <div className="flex flex-col lg:mt-[80px] mb-8 mx-auto w-fit p-6 bg-white border rounded-3xl max-w-[1050px]">
      <LogoutButton />
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="mb-2">
            <img
              className="mt-4 inline-flex rounded-full"
              src={LogoIcon}
              alt="User"
            />
          </div>
          <h1 className="text-2xl leading-snug text-gray-800 font-semibold mb-2">
            Explore Orders
          </h1>
          <div className="text-sm lg:w-[850px]">
            Browse and discover existing healthcare orders quickly and easily.
            <br />
            Search past orders by patient, date, doctor or type of order to find
            the details you need.
          </div>
        </div>
      </div>
      <div className='flex flex-col sm:px-8'>
        <div className="w-full flex gap-2">
          <div className='flex-1'>
            <label className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} size='sm' />
              </div>
              <input type="search" className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50" placeholder="Search orders" required />
              <button type="submit" className="text-white absolute end-2.5 bottom-[6px] bg-amber-700 hover:bg-amber-800 focus:outline-none font-medium rounded-lg text-sm px-4 py-1.5">Search</button>
            </div>
          </div>
          <div className='flex items-center'>
            <button type="button" className='order-button h-5/6 min-w-[120px] flex gap-1' onClick={onNewOrder}>
              <FontAwesomeIcon icon={faPlus} size='lg' />
              New Order
            </button>
          </div>
        </div>
        <div className='flex flex-wrap justify-center lg:justify-around items-center gap-6 mt-4'>
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                  #
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  OrderID
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Ordered By
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Equipment
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Created At
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order: any, index: number) => (
                <tr key={order.orderID} className='text-gray-900 even:bg-gray-50'>
                  <td className="whitespace-nowrap px-3 py-4 text-sm pl-0">{index + 1}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <div className="rounded-md text-center bg-blue-500/10 py-1 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20">
                      {order.orderStatus || 'N/A'}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">{order.orderID}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm pl-0">{order.orderedBy}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">{order.requestedItem}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">{order.createdDate}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm flex gap-1">
                    <Link to={`/order/view/${order.orderID}`} className="text-indigo-600 hover:text-indigo-900">
                      View
                    </Link>
                    <span>/</span>
                    <div onClick={() => onCancelOrder()} className="text-red-600 hover:text-red-500 cursor-pointer">
                      Cancel
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
