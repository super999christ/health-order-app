import { faAngleLeft } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { submitOrder } from '@root/apis/orders';
import { getProductCatalog } from '@root/apis/products';
import LogoIcon from '@root/assets/images/logo.png';
import { LogoutButton } from '@root/components/LogoutButton';
import Spinner from '@root/components/Spinner';
import { useFhirContext } from '@root/hooks/useFhirContext';
import { IProductCatatogItem } from '@root/types/product.type';
import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export default function OrderSubmissionPage() {
  const [isProcessing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { patient, encounter, fhirClient } = useFhirContext();
  const [catalogItems, setCatalogItems] = useState<IProductCatatogItem[]>([]);
  const [specialInstruction, setSpecialInstruction] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const facilityCode = getFacilityCode();
    if (facilityCode) {
      getProductCatalog(facilityCode).then(items => {
        setCatalogItems(items);
      });
    }
  }, [fhirClient]);
  
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setProcessing(true);
      await submitOrder({
        facilityCode: getFacilityCode(),
        department: getDepartmentName(),
        patientRoom: getPatientRoom(),
        bed: getBedNo(),
        orderCreatorFirstName: getOrderCreatorFirstName(),
        orderCreatorLastName: getOrderCreatorLastName(),
        orderCreatorPhoneNumber: phoneNumber,
        orderType: 'a',
        orderID: '0',
        patientID: patient?.id,
        patientFirstName: patient?.name?.length ? patient.name[0].given[0] : '',
        patientLastName: patient?.name?.length ? patient.name[0].family[0] : '',
        requestedItem: catalogItems[0].itemName,
        specialInstructions: specialInstruction,
        facility: catalogItems[0].facilityName,
        // orderStatus: "open",
        // orderData: 'testing order',
        // orderCreator: "testing order",
        // admissionDateTime: new Date().toString(),
        // epicIDNumber: '10000',
        // priority: 'high'
      });
    } catch (err) {
      console.log("Order submission failed: ", err);
    } finally {
      setProcessing(false);
    }
  };

  const onBack = () => {
    navigate('/order/list');
  };

  const getPatientName = () => {
    return patient?.name?.find((name) => name.use === "usual")?.text;
  };

  const getPatientRoom = () => {
    const location = encounter?.location?.find(loc => loc.physicalType?.text === 'Room');
    return location?.location.display;
  };

  const getOrderCreatorFirstName = () => {
    return fhirClient?.getState("tokenResponse.userFname");
  }

  const getOrderCreatorLastName = () => {
    return fhirClient?.getState("tokenResponse.userLname");
  }

  const getBedNo = () => {
    const location = encounter?.location?.find(loc => loc.physicalType?.text === 'Bed');
    return location?.location.identifier?.value;
  };

  const getFacilityCode = () => {
    return fhirClient?.getState("tokenResponse.facility");
  };

  const getFacilityName = () => {
    return catalogItems.length ? catalogItems[0].facilityName : '';
  };

  const getDepartmentName = () => {
    return fhirClient?.getState("tokenResponse.department");
  };
  
  return (
    <div className="flex flex-col lg:mt-[80px] lg:mb-8 mx-auto w-fit pl-10 lg:pl-6 pr-6 bg-white border rounded-3xl">
      <LogoutButton />
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
            Create Order
          </h1>
          <div className="text-sm">
            Creating a new healthcare order has never been easier. Simply select the type of order you need and fill out the quick form to submit your request.
          </div>
        </div>
        <form onSubmit={onSubmit} action='#'>
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
                    User First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="input-field"
                    type="text"
                    placeholder='Your First Name'
                    disabled={isProcessing}
                    value={getOrderCreatorFirstName()}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`input-field`}
                    type="text"
                    placeholder='Your Last Name'
                    disabled={isProcessing}
                    value={getOrderCreatorLastName()}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`input-field`}
                    type="text"
                    placeholder="1234 1234 1234 1234"
                    disabled={isProcessing}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
              <div className='flex space-x-4'>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Equipment Device Name
                  </label>
                  <select className={`input-field`} disabled={isProcessing}>
                    {catalogItems.map(item => (
                      <option key={item.orderCode}>{item.itemName}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Quantity
                  </label>
                  <select className={`input-field`} disabled={isProcessing}>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                  </select>
                </div>
                <div className='flex-1'>
                  <label className="block text-sm font-medium mb-1">
                    Option
                  </label>
                  <select className={`input-field`} disabled={isProcessing}>
                    <option>STAT</option>
                    <option>Routine</option>
                  </select>
                </div>
              </div>
              <div className='flex space-x-4'>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Special Instructions
                  </label>
                  <textarea
                    className={`textarea-field`}
                    placeholder="Your comment here"
                    disabled={isProcessing}
                    value={specialInstruction}
                    onChange={(e) => setSpecialInstruction(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className={`default-button mt-4`}
            disabled={isProcessing}
          >
            {isProcessing && <Spinner />}
            Submit
          </button>
          <button
            type="button"
            className={`back-button mt-2`}
            disabled={isProcessing}
            onClick={onBack}
          >
            <FontAwesomeIcon icon={faAngleLeft} size='lg' className='mr-1' />
            View List
          </button>
        </form>
      </div>
    </div>
  );
}
