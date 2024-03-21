import { faAngleLeft } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { submitOrder } from '@root/apis/orders';
import { getProductCatalog } from '@root/apis/products';
import LogoIcon from '@root/assets/images/logo.png';
import ErrorText from '@root/components/ErrorText';
import { LoadingBar } from '@root/components/LoadingBar';
import { LogoutButton } from '@root/components/LogoutButton';
import Spinner from '@root/components/Spinner';
import Environment from '@root/constants/base';
import { useFhirContext } from '@root/hooks/useFhirContext';
import { IProductCatatogItem } from '@root/types/product.type';
import { orderCreatorPhoneNumberValidatorOptions, requestedItemValidatorOptions } from '@root/validators/order-form-validation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export interface IOrderRequest {
  orderCreatorPhoneNumber: string;
  requestedItem: string;
  specialInstructions: string;
  quantity: number;
}

export default function OrderSubmissionPage() {
  const [isProcessing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { patient, encounter, fhirClient } = useFhirContext();
  const [catalogItems, setCatalogItems] = useState<IProductCatatogItem[]>([]);
  const [isLoading, setLoading] = useState(true);
  const { register, getValues, setValue, handleSubmit, setError, formState: { errors } } = useForm<IOrderRequest>({
    defaultValues: {
      quantity: 1
    }
  });

  useEffect(() => {
    const facilityCode = getFacilityCode();
    if (facilityCode) {
      getProductCatalog(facilityCode).then(items => {
        setCatalogItems(items);
        if (items.length > 0) {
          setValue('requestedItem', items[0].orderCode);
        }
      });
    }
  }, [fhirClient]);

  useEffect(() => {
    if (patient && catalogItems.length > 0) {
      setLoading(false);
    }
  }, [patient, catalogItems]);

  const onSubmit = async () => {
    try {
      setProcessing(true);
      const formValues = getValues();
      await submitOrder({
        ...formValues,
        facilityCode: getFacilityCode(),
        department: getDepartmentName(),
        patientRoom: getPatientRoom(),
        bed: getBedNo(),
        orderCreatorFirstName: getOrderCreatorFirstName(),
        orderCreatorLastName: getOrderCreatorLastName(),
        orderCreator: getOrderCreatorFirstName() + ' ' + getOrderCreatorLastName(),
        orderType: 'NW',
        patientID: patient?.id,
        patientFirstName: patient?.name?.length ? patient.name[0].given[0] : '',
        patientLastName: patient?.name?.length ? patient.name[0].family[0] : '',
        priority: "1",
        admissionDateTime: new Date().toString(),
        epicIDNumber: Environment.EPIC_ID_NUMBER,
      });
      navigate(`/order/confirm`); // mock order ID
    } catch (err) {
      console.log("Order submission failed: ", err);
      setError('root.server', {
        message: 'Something went wrong. Please try again some time later'
      });
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
    return location?.location.display || '4200';
  };

  const getOrderCreatorFirstName = () => {
    return fhirClient?.getState("tokenResponse.userFname") || "Randall";
  }

  const getOrderCreatorLastName = () => {
    return fhirClient?.getState("tokenResponse.userLname") || "Christ";
  }

  const getBedNo = () => {
    const location = encounter?.location?.find(loc => loc.physicalType?.text === 'Bed');
    return location?.location.identifier?.value || '4200-01';
  };

  const getFacilityCode = () => {
    return fhirClient?.getState("tokenResponse.facility") || 'GHS';
  };

  const getFacilityName = () => {
    return catalogItems.length ? catalogItems[0].facilityName : '';
  };

  const getDepartmentName = () => {
    return fhirClient?.getState("tokenResponse.department") || "KHMRG";
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
            Create Order
          </h1>
          <div className="text-sm">
            Creating a new healthcare order has never been easier. Simply select the type of order you need and fill out the quick form to submit your request.
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} action='#'>
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
                    placeholder="123-456-7890"
                    disabled={isProcessing}
                    {...register('orderCreatorPhoneNumber', orderCreatorPhoneNumberValidatorOptions)}
                  />
                  <ErrorText>{errors.orderCreatorPhoneNumber?.message}</ErrorText>
                </div>
              </div>
              <div className='flex space-x-4'>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Equipment Device Name
                  </label>
                  <select
                    className={`input-field`}
                    disabled={isProcessing}
                    {...register('requestedItem', requestedItemValidatorOptions)}
                  >
                    {catalogItems.map(item => (
                      <option key={item.orderCode} value={item.orderCode}>{item.itemName}</option>
                    ))}
                  </select>
                  <ErrorText>{errors.requestedItem?.message}</ErrorText>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Quantity
                  </label>
                  <select
                    className={`input-field`}
                    disabled={isProcessing}
                    {...register('quantity')}
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
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
                    {...register('specialInstructions')}
                  />
                </div>
              </div>
            </div>
          </div>
          <ErrorText>{errors.root?.server.message}</ErrorText>
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
