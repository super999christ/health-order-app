import { faArrowLeft } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cancelOrder, getOrdersByPatient, requestPickup } from '@root/apis/orders';
import { getProductCatalog } from '@root/apis/products';
import LogoIcon from '@root/assets/images/logo.png';
import { LoadingBar } from '@root/components/LoadingBar';
import { LogoutButton } from '@root/components/LogoutButton';
import Environment from '@root/constants/base';
import { useFhirContext } from '@root/hooks/useFhirContext';
import { IOrder } from '@root/types/order.type';
import { IProductCatatogItem } from '@root/types/product.type';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Nullable } from 'vitest';

export default function OrderViewPage() {
  const [isLoading, setLoading] = useState(true);
  const [catalogItems, setCatalogItems] = useState<IProductCatatogItem[]>([]);
  const { patient, encounter, fhirClient, meta } = useFhirContext();
  const { orderId } = useParams();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Nullable<IOrder>>();
  const navigate = useNavigate();

  useEffect(() => {
    const facilityCode = meta?.facilityCode;
    if (facilityCode) {
      getProductCatalog(facilityCode).then(items => {
        setCatalogItems(items);
      });
    }
  }, [fhirClient, meta]);
  
  useEffect(() => {
    const PatientID = patient?.id as string;
    if (PatientID) {
      getOrdersByPatient({ PatientID, EpicIDNumber: Environment.EPIC_ID_NUMBER })
        .then((orders: IOrder[]) => {
          setOrders(orders);
          const order = orders.find((order: any) => order.orderID == orderId);
          if (order)
            setCurrentOrder(order);
        })
        .catch(err => {
          console.log("Error while getting orders: ", { PatientID }, err);
        }).finally(() => {
          setLoading(false);
        });
    }
  }, [patient]);

  const getFacilityName = () => {
    return catalogItems.length ? catalogItems[0].facilityName : '';
  };

  const getPatientName = () => {
    var name = patient?.name?.find((name) => name.use === "usual")?.text
    if (!name) {
      return name;
    }
    return name.split(' ')[0][0] + 'xxxxx' + ' ' + name.split(' ')[1][0] + 'xxxxx';
  };

  const getPatientRoom = () => {
    const location = encounter?.location?.find(loc => loc.physicalType?.text === 'Room');
    return location?.location.display || '4200';
  };

  const getBedNo = () => {
    const location = encounter?.location?.find(loc => loc.physicalType?.text === 'Bed');
    return location?.location.identifier?.value || '4200-01';
  };

  const getOrderCreatorFirstName = () => {
    return currentOrder?.orderedBy.split(' ')[0];
  }

  const getOrderCreatorLastName = () => {
    return currentOrder?.orderedBy.split(' ')[1];
  }

  const onCancelOrder = async () => {
    if (confirm("Are you sure you want to cancel this order?")) {
      await cancelOrder([{ epicIDNumber: Environment.EPIC_ID_NUMBER, orderID: orderId! }]);
      navigate('/order/list');
    }
  };

  const onRequestPickup = async () => {
    if (confirm("Are you sure you want to request this order?")) {
      await requestPickup([{ epicIDNumber: Environment.EPIC_ID_NUMBER, orderID: orderId!, requestpickup: true }])
      navigate('/order/list');
    }
  };

  const getEquipmentName = () => {
    const equipment = catalogItems.find(item => item.orderCode === currentOrder?.requestedItem);
    return equipment?.itemName;
  };
  
  return (
    <div className="flex flex-col lg:mt-[80px] lg:mb-8 mx-auto w-fit pl-10 lg:pl-6 pr-6 bg-white border rounded-3xl">
      <LogoutButton />
      {isLoading && <LoadingBar />}
      <div
        className="relative px-4 sm:px-6 lg:px-8 pb-6 lg:w-[850px]"
      >
        <div className="text-center mb-4">
          <div className="mb-4">
            <img
              className="mt-4 inline-flex rounded-full"
              src={LogoIcon}
              alt="User"
            />
          </div>
          <h1 className="text-2xl leading-snug font-semibold bg-[#01426A] text-white w-full p-2 text-left rounded-sm">
            View Order #{orderId}
          </h1>
        </div>
        <div>
          <div className='font-medium p-4 rounded-xl border-2 border-solid bg-blue-50'>
            <div className="space-y-6 text-left">
              <div className="flex space-x-4 gap-4">
                <div className='flex-1'>
                  <label className="block text-md font-semibold mb-1">
                    User Full name
                  </label>
                  <label className='block text-sm font-normal'>
                    {getOrderCreatorFirstName() + ' ' + getOrderCreatorLastName()}
                  </label>
                </div>
                <div className='flex-1'>
                  <label className="block text-md font-semibold mb-1">
                    Phone Number
                  </label>
                  <label className='block text-sm font-normal'>
                    {"123-456-7890"}
                  </label>
                </div>
              </div>
              <div className="flex space-x-4 gap-4">
                <div className='flex-1'>
                  <label className="block text-md font-semibold mb-1">
                    Facility Name
                  </label>
                  <label className='block text-sm font-normal'>
                    {getFacilityName()}
                  </label>
                </div>
                <div className='flex-1'>
                  <label className="block text-md font-semibold mb-1">
                    Equipment Name
                  </label>
                  <label className='block text-sm font-normal'>
                    {getEquipmentName()}
                  </label>
                </div>
              </div>
              <div className="flex space-x-4 gap-4">
                <div className='flex-1'>
                  <label className="block text-md font-semibold mb-1">
                    Department
                  </label>
                  <label className='block text-sm font-normal'>
                    {meta?.department}
                  </label>
                </div>
                <div className='flex-1'>
                  <label className="block text-md font-semibold mb-1">
                    Quantity
                  </label>
                  <label className='block text-sm font-normal'>
                    {1}
                  </label>
                </div>
              </div>
              <div className="flex space-x-4 gap-4">
                <div className='flex-1'>
                  <label className="block text-md font-semibold mb-1">
                    Patient Name
                  </label>
                  <label className='block text-sm font-normal'>
                    {getPatientName()}
                  </label>
                </div>
                <div className='flex-1'>
                  <label className="block text-md font-semibold mb-1">
                    Bed No.
                  </label>
                  <label className='block text-sm font-normal'>
                    {getBedNo()}
                  </label>
                </div>
              </div>
              <div className="flex space-x-4 gap-4">
                <div className='flex-1'>
                  <label className="block text-md font-semibold mb-1">
                    Patient Room
                  </label>
                  <label className='block text-sm font-normal'>
                    {getPatientRoom()}
                  </label>
                </div>
                <div className='flex-1'>
                  <label className="block text-md font-semibold mb-1">
                    Priority
                  </label>
                  <label className='block text-sm font-normal'>
                    {"STAT"}
                  </label>
                </div>
              </div>
              <div className="flex space-x-4 gap-4">
                <div className='flex-1'>
                  <label className="block text-md font-semibold mb-1">
                    Special Instructions
                  </label>
                  <label className='block text-sm font-normal'>
                    {"Your comment here"}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className='flex justify-between mt-4 px-2'>
            <Link to="/order/list" className='flex items-center gap-1 text-md'>
              <FontAwesomeIcon icon={faArrowLeft} />
              View List
            </Link>
            <div className='flex gap-2'>
              {currentOrder?.orderStatus === 'In Transit' || currentOrder?.orderStatus === 'Delivered' && (
                <button
                  type='button'
                  className='btn-success w-40'
                  onClick={onRequestPickup}
                >
                  Request Pickup
                </button>
              )}
              {currentOrder?.orderStatus === 'Submitted' && (
                <button
                  type='button'
                  className="btn-agiliti-orange w-32"
                  onClick={onCancelOrder}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
