import { faAngleLeft, faEye } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getLatestOrder } from '@root/apis/orders';
import LogoIcon from '@root/assets/images/logo.png';
import { LoadingBar } from '@root/components/LoadingBar';
import { LogoutButton } from '@root/components/LogoutButton';
import Environment from '@root/constants/base';
import { useFhirContext } from '@root/hooks/useFhirContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderConfirmPage() {
  const [orderId, setOrderId] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { patient } = useFhirContext();

  useEffect(() => {
    if (!patient)
      return;
    setLoading(true);
    setTimeout(() => {
      getLatestOrder({ PatientID: patient?.id, EpicIDNumber: Environment.EPIC_ID_NUMBER })
      .then(order => {
        setLoading(false);
        setOrderId(order.OrderID);
      }).catch(err => {
        console.log("Error while getting the latest order: ", err);
        const errorMsg = 'New order was not found';
        setError(errorMsg);
        alert(errorMsg);
      }).finally(() => {
        setLoading(false);
      });
    }, 5000);
  }, [patient]);
  
  const onBack = () => {
    navigate('/order/list');
  };

  const onViewOrder = () => {
    navigate(`/order/view/${orderId}`);
  };
  
  return (
    <div className="flex flex-col lg:mt-[80px] lg:mb-8 mx-auto w-fit pl-10 lg:pl-6 pr-6 bg-white border rounded-3xl">
      <LogoutButton />
      {isLoading && <LoadingBar />}
      <div
        className="relative px-4 sm:px-6 lg:px-8 pb-6 w-[370px]"
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
            Order Confirmation #{orderId}
          </h1>
          <div className="text-sm">
            {!isLoading && !error && 'New order was created successfully'}
            {error}
          </div>
        </div>
        <form onSubmit={onBack} action='#' className='text-center'>
          <div className='font-medium'>
            <div className="space-y-4 text-center mt-8">
              
            </div>
          </div>
          <button
            className={`btn-success mt-4 w-full`}
            onClick={onViewOrder}
            disabled={isLoading || !!error}
          >
            <FontAwesomeIcon icon={faEye} size='lg' className='mr-1' />
            View
          </button>
          <button
            className={`btn-back mt-4`}
            type="submit"
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
