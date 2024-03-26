import { faArrowLeft } from '@fortawesome/pro-regular-svg-icons';
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
import { Link, useNavigate } from 'react-router-dom';

export interface IOrderRequest {
  orderCreatorPhoneNumber: string;
  requestedItem: string;
  specialInstructions: string;
  quantity: number;
}

export default function OrderSubmissionPage() {
  const [isProcessing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { patient, encounter, fhirClient, meta } = useFhirContext();
  const [catalogItems, setCatalogItems] = useState<IProductCatatogItem[]>([]);
  const [isLoading, setLoading] = useState(true);
  const { register, getValues, setValue, handleSubmit, setError, formState: { errors } } = useForm<IOrderRequest>({
    defaultValues: {
      quantity: 1
    }
  });

  useEffect(() => {
    const facilityCode = meta?.facilityCode;
    if (facilityCode) {
      getProductCatalog(facilityCode).then(items => {
        setCatalogItems(items);
        if (items.length > 0) {
          setValue('requestedItem', items[0].orderCode);
        }
      });
    }
  }, [fhirClient, meta]);

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
        facilityCode: meta?.facilityCode,
        department: meta?.department,
        patientRoom: getPatientRoom(),
        bed: getBedNo(),
        orderCreatorFirstName: meta?.firstName,
        orderCreatorLastName: meta?.lastName,
        orderCreator: meta?.firstName + ' ' + meta?.lastName,
        orderType: 'NW',
        patientID: patient?.id,
        patientFirstName: patient?.name?.length ? patient.name[0].given[0] : '',
        patientLastName: patient?.name?.length ? patient.name[0].family[0] : '',
        priority: "1",
        admissionDateTime: new Date().toString(),
        epicIDNumber: Environment.EPIC_ID_NUMBER,
        requestedItem: [
          {
            item: formValues.requestedItem,
            quantity: formValues.quantity
          }
        ]
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

  const getFacilityName = () => {
    return catalogItems.length ? catalogItems[0].facilityName : '';
  };

  return (
    <div className="flex flex-col lg:mt-[80px] lg:mb-8 mx-auto w-fit pl-10 lg:pl-6 pr-6 bg-white border rounded-3xl">
      <LogoutButton />
      {isLoading && <LoadingBar />}
      <div
        className="relative px-4 sm:px-6 lg:px-8 pb-6 lg:w-[850px]"
      >
        <div className="text-center mb-6">
          <div className="mb-4">
            <img
              className="mt-4 inline-flex rounded-full"
              src={LogoIcon}
              alt="User"
            />
          </div>
          <h1 className="text-2xl leading-snug font-semibold bg-[#0a4069] text-white w-full p-2 text-left rounded-sm">
            Create Order
          </h1>
          <div className="text-sm mt-2 text-left">
            Creating a new healthcare order has never been easier. Simply select the type of order you need and fill out the quick form to submit your request.
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} action='#'>
          <div className='font-medium'>
            <div className="space-y-4 text-center">
              <div className="flex space-x-4 gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-left">
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
                  <label className="block text-sm font-medium mb-1 text-left">
                    User Full Name
                  </label>
                  <input
                    className={`input-field !bg-gray-50`}
                    type="text"
                    readOnly={true}
                    value={meta?.firstName + ' ' + meta?.lastName}
                  />
                </div>
              </div>
              <div className="flex space-x-4 gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-left">
                    Department
                  </label>
                  <input
                    className={`input-field !bg-gray-50`}
                    type="text"
                    readOnly={true}
                    value={meta?.department}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-left">
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
              <div className="flex space-x-4 gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-left">
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
                  <label className="block text-sm font-medium mb-1 text-left">
                    Equipment Name
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
              </div>
              <div className="flex space-x-4 gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-left">
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
                  <label className="block text-sm font-medium mb-1 text-left">
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
              </div>
              <div className='flex space-x-4 gap-4'>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-left">
                    Bed No.
                  </label>
                  <input
                    className={`input-field !bg-gray-50`}
                    type="text"
                    readOnly={true}
                    value={getBedNo()}
                  />
                </div>
                <div className='flex-1'>
                  <label className="block text-sm font-medium mb-1 text-left">
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
                  <label className="block text-sm font-medium mb-1 text-left">
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
          <div className='flex justify-between mt-4 '>
            <Link to="/order/list" className='flex items-center gap-1 text-md'>
              <FontAwesomeIcon icon={faArrowLeft} />
              View List
            </Link>
            <button
              type="submit"
              className="btn-warning w-40"
              disabled={isProcessing}
            >
              {isProcessing && <Spinner />}
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
