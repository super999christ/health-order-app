import { faAngleLeft } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getOrdersByPatient } from '@root/apis/orders';
import { getProductCatalog } from '@root/apis/products';
import LogoIcon from '@root/assets/images/logo.png';
import { LoadingBar } from '@root/components/LoadingBar';
import { LogoutButton } from '@root/components/LogoutButton';
import Environment from '@root/constants/base';
import { useFhirContext } from '@root/hooks/useFhirContext';
import { IProductCatatogItem } from '@root/types/product.type';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function OrderViewPage() {
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [catalogItems, setCatalogItems] = useState<IProductCatatogItem[]>([]);
  const { patient, encounter, fhirClient } = useFhirContext();
  const { orderId } = useParams();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const facilityCode = getFacilityCode();
    if (facilityCode) {
      getProductCatalog(facilityCode).then(items => {
        setCatalogItems(items);
      });
    }
  }, [fhirClient]);
  
  useEffect(() => {
    const PatientID = patient?.id as string;
    if (PatientID) {
      getOrdersByPatient({ PatientID, EpicIDNumber: Environment.EPIC_ID_NUMBER })
        .then(res => {
          setOrders(res);
        })
        .catch(err => {
          console.log("Error while getting orders: ", { PatientID }, err);
        }).finally(() => {
          setLoading(false);
        });
    }
  }, [patient]);
  
  const onBack = () => {
    navigate('/order/list');
  };

  const getFacilityCode = () => {
    return 'GHS';
    // return fhirClient?.getState("tokenResponse.facility");
  };

  const getDepartmentName = () => {
    return fhirClient?.getState("tokenResponse.department") || "KHMRG";
  };

  const getFacilityName = () => {
    return catalogItems.length ? catalogItems[0].facilityName : '';
  };

  const getPatientName = () => {
    return patient?.name?.find((name) => name.use === "usual")?.text;
  };

  const getPatientRoom = () => {
    const location = encounter?.location?.find(loc => loc.physicalType?.text === 'Room');
    return location?.location.display || '4200';
  };

  const getBedNo = () => {
    const location = encounter?.location?.find(loc => loc.physicalType?.text === 'Bed');
    return location?.location.identifier?.value || '4200-01';
  };

  const getCurrentOrder = () => {
    const order: any = orders.find((order: any) => order.orderID == orderId);
    return order;
  };

  const getOrderCreatorFirstName = () => {
    const order = getCurrentOrder();
    if (order) {
      return order.orderedBy.split(' ')[0];
    }
    return '';
  }

  const getOrderCreatorLastName = () => {
    const order = getCurrentOrder();
    if (order) {
      return order.orderedBy.split(' ')[1];
    }
    return '';
  }

  const onCancelOrder = () => {
    if (confirm("Are you sure you want to cancel this order?")) {
      // TODO: Call API to cancel the order
    }
  };
  
  return (
    <div className="flex flex-col lg:mt-[80px] lg:mb-8 mx-auto w-fit pl-10 lg:pl-6 pr-6 bg-white border rounded-3xl">
      <LogoutButton />
      {isLoading && <LoadingBar />}
      <div
        className="relative px-4 sm:px-6 lg:px-8 pb-6 max-w-[650px]"
      >
        <div className="text-center mb-6">
          <div className="mb-2">
            <img
              className="mt-4 inline-flex rounded-full"
              src={LogoIcon}
              alt="User"
            />
          </div>
          <h1 className="text-2xl leading-snug text-gray-800 font-semibold mb-2">
            View Order
          </h1>
          <div className="text-sm">
            Quickly look up existing orders by ID or patient. See item, status, notes and more. Easy management of past requests.
          </div>
        </div>
        <form onSubmit={onBack} action='#'>
          <div className='font-medium'>
            <div className="space-y-4 text-center mt-8">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Facility Name
                  </label>
                  <input
                    className={`input-field !bg-gray-50`}
                    type="text"
                    readOnly={true}
                    value={getFacilityName()}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Department
                  </label>
                  <input
                    className={`input-field !bg-gray-50`}
                    type="text"
                    readOnly={true}
                    value={getDepartmentName()}
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Patient Name
                  </label>
                  <input
                    className={`input-field !bg-gray-50`}
                    type="text"
                    readOnly={true}
                    value={getPatientName()}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Patient Room
                  </label>
                  <input
                    className={`input-field !bg-gray-50`}
                    type="text"
                    readOnly={true}
                    value={getPatientRoom()}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Bed No.
                  </label>
                  <input
                    className={`input-field !bg-gray-50`}
                    type="text"
                    readOnly={true}
                    value={getBedNo()}
                  />
                </div>
              </div>
              <hr className='!my-8' />
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`input-field !bg-gray-50`}
                    type="text"
                    placeholder='Your First Name'
                    readOnly={true}
                    value={getOrderCreatorFirstName()}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`input-field !bg-gray-50`}
                    type="text"
                    placeholder='Your Last Name'
                    readOnly={true}
                    value={getOrderCreatorLastName()}
                  />
                </div>
              </div>
              <div className='flex space-x-4'>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`input-field !bg-gray-50`}
                    type="text"
                    placeholder="1234 1234 1234 1234"
                    readOnly={true}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Equipment Device Name
                  </label>
                  <select className={`input-field !bg-gray-50`} disabled={isLoading} value={getCurrentOrder()?.requestedItem}>
                    {catalogItems.map(item => (
                      <option key={item.orderCode}>{item.itemName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='flex space-x-4'>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Comment
                  </label>
                  <textarea
                    className={`textarea-field !bg-gray-50`}
                    placeholder="Your comment here"
                    readOnly={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            className={`danger-button mt-4`}
            onClick={onCancelOrder}
          >
            Cancel Order
          </button>
          <button
            className={`back-button mt-4`}
            onClick={onBack}
          >
            <FontAwesomeIcon icon={faAngleLeft} size='lg' className='mr-1' />
            Back
          </button>
        </form>
      </div>
    </div>
  );
}
