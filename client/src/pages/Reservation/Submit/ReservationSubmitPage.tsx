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
import { useNavigate } from 'react-router-dom';

export default function ReservationSubmitPage() {
  const [isProcessing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { patient, encounter, fhirClient } = useFhirContext();
  const [catalogItems, setCatalogItems] = useState<IProductCatatogItem[]>([]);
  const [specialInstruction] = useState("");
  const [phoneNumber] = useState("");

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
      });
    } catch (err) {
      console.log("Order submission failed: ", err);
    } finally {
      setProcessing(false);
    }
  };

  const onBack = () => {
    navigate('/reservation/calendar');
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

  const getDepartmentName = () => {
    return fhirClient?.getState("tokenResponse.department");
  };
  
  return (
    <div className="flex flex-col lg:mt-[80px] lg:mb-8 mx-auto w-fit pl-10 lg:pl-6 pr-6 bg-white border rounded-3xl">
      <LogoutButton />
      <div
        className="relative px-4 sm:px-6 lg:px-8 pb-6 max-w-[800px]"
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
            Make New Reservation
          </h1>
          <div className="text-sm text-red-500">
            Note: The system will only accept reservations for cases scheduled 36 hours in advance. Reservation made must be for after 03/06/2024 07:09 PM. If you would like to make a reservation within 36 hours, please call our Scheduling Department at 800.660.6162, Option 1.
          </div>
        </div>
        <form onSubmit={onSubmit} action='#'>
          <div className='font-medium'>
            <div className="space-y-4 text-center mt-8">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Select Date For New Reservation
                  </label>
                  <input
                    className={`input-field !bg-gray-50`}
                    type="text"
                    readOnly={true}
                  />
                </div>
                <div className="max-w-44">
                  <label className="block text-sm font-medium mb-1">
                    Preferred Start Time
                  </label>
                  <input
                    className={`input-field !bg-gray-50`}
                    type="text"
                    readOnly={true}
                  />
                </div>
                <div className="max-w-44">
                  <label className="block text-sm font-medium mb-1">
                    Preferred End Time
                  </label>
                  <input
                    className={`input-field !bg-gray-50`}
                    type="text"
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Select Medical Procedure
                  </label>
                  <input
                    className={`input-field !bg-gray-50`}
                    type="text"
                    readOnly={true}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Select Doctor
                  </label>
                  <input
                    className={`input-field !bg-gray-50`}
                    type="text"
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="flex gap-2 items-center">
                  <label className="text-sm font-medium">
                    Tech Only
                  </label>
                  <input
                    className={`!bg-gray-50 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600`}
                    type="checkbox"
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
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Scheduler Name
                  </label>
                  <input
                    className={`input-field !bg-gray-50`}
                    type="text"
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Phone
                  </label>
                  <input
                    className={`input-field !bg-gray-50`}
                    type="text"
                    readOnly={true}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    className={`input-field !bg-gray-50`}
                    type="text"
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Comment
                  </label>
                  <input
                    className={`input-field !bg-gray-50`}
                    type="text"
                    readOnly={true}
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
