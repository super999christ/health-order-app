import { faArrowRight, faPlus, faSearch } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cancelOrder, getOrdersByPatient, requestPickup } from '@root/apis/orders';
import { getProductCatalog } from '@root/apis/products';
import LogoIcon from '@root/assets/images/logo.png';
import { LoadingBar } from '@root/components/LoadingBar';
import { LogoutButton } from '@root/components/LogoutButton';
import { StatusBadge } from '@root/components/StatusBadge';
import Environment from '@root/constants/base';
import { useFhirContext } from '@root/hooks/useFhirContext';
import { IOrder } from '@root/types/order.type';
import { IProductCatatogItem } from '@root/types/product.type';
import { ColorMode } from '@root/types/ui.type';
import { formatDateTime } from '@root/utils/date';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function OrderListPage() {
  const navigate = useNavigate();
  const { patient, meta } = useFhirContext();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [catalogItems, setCatalogItems] = useState<IProductCatatogItem[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    const PatientID = patient?.id as string;
    if (PatientID) {
      setLoading(true);
      getOrdersByPatient({ PatientID, EpicIDNumber: Environment.EPIC_ID_NUMBER })
        .then(res => {
          setOrders(res.reverse());
        })
        .catch(err => {
          console.log("Error while getting orders: ", { PatientID }, err);
        }).finally(() => {
          setLoading(false);
        });
    }
  }, [patient]);

  useEffect(() => {
    setFilteredOrders(orders.filter(order => {
      if (order.orderedBy.toLowerCase().includes(searchKeyword.toLowerCase()))
        return true;
      if (getEquipmentName(order.requestedItem).toLowerCase().includes(searchKeyword.toLowerCase()))
        return true;
      return false;
  }));
  }, [orders, searchKeyword]);

  useEffect(() => {
    const facilityCode = meta?.facilityCode;
    if (facilityCode) {
      getProductCatalog(facilityCode).then(items => {
        setCatalogItems(items);
      });
    }
  }, [meta]);

  const onNewOrder = () => {
    navigate('/order/submit');
  };

  const getEquipmentName = (code: string) => {
    return catalogItems.find(item => item.orderCode === code)?.itemName || '';
  }

  const getColorFromOrderStatus = (orderStatus: string): ColorMode => {
    switch (orderStatus) {
      case 'Submitted':
        return 'primary';
      case 'Delivered':
      case 'In Transit':
        return 'warning';
      case 'Pick Up Requested':
        return 'info';
      case 'Picked Up':
        return 'success';
      case 'Cancelled':
        return 'danger';
    }
    return 'primary';
  }

  const onCancelOrder = async (orderId: number) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      try {
        setLoading(true);
        await cancelOrder([{ epicIDNumber: Environment.EPIC_ID_NUMBER, orderID: String(orderId) }]);
        setLoading(false);
        setTimeout(() => {
          alert("Order was cancelled successfully");
        }, 200);
      } catch (err) {
        setLoading(false);
        setTimeout(() => {
          alert("Something went wrong. Please try again later.");
        }, 200);
      }
    }
  };

  const onRequestPickup = async (orderId: number) => {
    if (confirm("Are you sure you want to request pickup for this order?")) {
      try {
        setLoading(true);
        await requestPickup([{ epicIDNumber: Environment.EPIC_ID_NUMBER, orderID: String(orderId), requestpickup: true }]);
        setLoading(false);
        setTimeout(() => {
          alert("Order pickup request was submitted successfully");
        }, 200);
      } catch (err) {
        setLoading(false);
        setTimeout(() => {
          alert("Something went wrong. Please try again later.");
        }, 200);
      }
    }
  }

  return (
    <div className="flex flex-col lg:mt-[80px] mb-8 mx-auto w-fit p-6 bg-white border rounded-3xl lg:w-[1050px]">
      <LogoutButton />
      {isLoading && <LoadingBar />}
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="mb-4">
            <img
              className="mt-4 inline-flex rounded-full"
              src={LogoIcon}
              alt="User"
            />
          </div>
          <h1 className="text-2xl leading-snug font-semibold bg-[#f09049] text-white w-full p-2 text-left rounded-sm">
            Explore Orders
          </h1>
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
              <input type="search" className="block w-full p-3 h-10 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50" placeholder="Search orders" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} required />
              {!searchKeyword && (
                <div className="absolute inset-y-0 end-2.5 flex items-center ps-3 pointer-events-none">
                    <FontAwesomeIcon icon={faArrowRight} size='sm' />
                </div>
              )}
            </div>
          </div>
          <div className='flex items-center'>
            <button type="button" className='btn-success h-full min-w-[120px] flex gap-1' onClick={onNewOrder}>
              <FontAwesomeIcon icon={faPlus} size='lg' />
              New Order
            </button>
          </div>
        </div>
        <div className='flex flex-wrap justify-center lg:justify-around items-center gap-6 mt-4'>
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" className="px-3 py-3.5 pl-0 text-left text-sm font-semibold text-gray-900">
                  Order Date
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                  Order ID
                </th>
                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 max-w-52">
                  Equipment
                </th>
                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order: IOrder) => (
                <tr key={order.orderID} className='text-gray-900 even:bg-gray-50'>
                  <td className="whitespace-nowrap text-left px-3 py-4 pl-0 text-sm">{formatDateTime(order.createdDate)}</td>
                  <td className="whitespace-nowrap text-left px-3 py-4 text-sm">{order.orderedBy}</td>
                  <td className="whitespace-nowrap text-center px-3 py-4 text-sm">
                    <StatusBadge color={getColorFromOrderStatus(order.orderStatus)}>
                      {order.orderStatus || 'OPEN'}
                    </StatusBadge>
                  </td>
                  <td className="whitespace-nowrap text-center px-3 py-4 text-sm">
                    <Link to={`/order/view/${order.orderID}`} className="text-indigo-600 hover:text-indigo-900 underline">
                      {order.orderID}
                    </Link>
                  </td>
                  <td className="text-center px-3 py-4 text-sm max-w-52">{getEquipmentName(order.requestedItem)}</td>
                  <td className="whitespace-nowrap text-center px-3 py-4 text-sm flex flex-col justify-center gap-1">
                    {order.orderStatus === 'Submitted' && (
                      <button className='btn-danger' title="Cancel" onClick={() => onCancelOrder(order.orderID)}>
                        Cancel
                      </button>
                    )}
                    {(order.orderStatus === 'In Transit' || order.orderStatus === 'Delivered') && (
                      <button className='btn-success' title="Request Pickup" onClick={() => onRequestPickup(order.orderID)}>
                        Pick up
                      </button>
                    )}
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
