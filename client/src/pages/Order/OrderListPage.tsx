import { faPlus } from '@fortawesome/pro-regular-svg-icons';
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
    // return 'primary' || orderStatus;
    // switch (orderStatus) {
    //   case 'Submitted':
    //     return 'primary';
    //   case 'Delivered':
    //   case 'In Transit':
    //     return 'warning';
    //   case 'Pick Up Requested':
    //     return 'info';
    //   case 'Picked Up':
    //     return 'success';
    //   case 'Cancelled':
    //     return 'danger';
    // }
    // return 'primary';
  }

  const getTextFromOrderStatus = (orderStatus: string): string => {
    if (!orderStatus)
      return 'Open';
    if (orderStatus === 'Cancelled')
      return 'Cancel';
    return orderStatus;
  };

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
        <div className="text-center flex flex-col items-center">
          <div className="mb-4">
            <img
              className="inline-flex rounded-full"
              src={LogoIcon}
              alt="User"
            />
          </div>
          <h1 className="text-2xl leading-snug font-semibold bg-[#01426A] text-white w-full p-2 text-left rounded-sm">
            Explore Orders
          </h1>
        </div>
      </div>
      <div className='flex flex-col sm:px-8'>
        <div className='flex justify-start my-4'>
          <button type="button" className='btn-agiliti-orange h-full min-w-[220px] flex gap-1' onClick={onNewOrder}>
            <FontAwesomeIcon icon={faPlus} size='lg' />
            New Order
          </button>
        </div>
        <div className='flex flex-wrap justify-center lg:justify-around items-center gap-6'>
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" className="px-3 py-3.5 pl-0 text-left text-sm font-semibold text-gray-900">
                  Order Date
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Requestor Name
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
              {orders.map((order: IOrder) => (
                <tr key={order.orderID} className='text-gray-900 even:bg-gray-50'>
                  <td className="whitespace-nowrap text-left px-3 py-4 pl-0 text-sm">{formatDateTime(order.createdDate)}</td>
                  <td className="whitespace-nowrap text-left px-3 py-4 text-sm">{order.orderedBy}</td>
                  <td className="whitespace-nowrap text-center px-3 py-4 text-sm">
                    {getTextFromOrderStatus(order.orderStatus)}
                  </td>
                  <td className="whitespace-nowrap text-center px-3 py-4 text-sm">
                    <Link to={`/order/view/${order.orderID}`} className="text-indigo-600 hover:text-indigo-900 underline">
                      {order.orderID}
                    </Link>
                  </td>
                  <td className="text-center px-3 py-4 text-sm max-w-52">{getEquipmentName(order.requestedItem)}</td>
                  <td className="whitespace-nowrap text-center px-3 py-4 text-sm">
                    {order.orderStatus === 'Submitted' && (
                      <button className='btn-agiliti-orange w-full' title="Cancel" onClick={() => onCancelOrder(order.orderID)}>
                        Cancel
                      </button>
                    )}
                    {(order.orderStatus === 'In Transit' || order.orderStatus === 'Delivered') && (
                      <button className='btn-agiliti-orange w-full mt-2' title="Request Pickup" onClick={() => onRequestPickup(order.orderID)}>
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
