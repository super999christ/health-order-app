import { faAngleLeft, faEye } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LogoIcon from '@root/assets/images/logo.png';
import { LogoutButton } from '@root/components/LogoutButton';
import { useNavigate, useParams } from 'react-router';

export default function OrderConfirmPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const onBack = () => {
    navigate('/order/list');
  };

  const onViewOrder = () => {
    navigate(`/order/view/${orderId}`);
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
            Order Confirmation #{orderId}
          </h1>
          <div className="text-sm">
            New order was created successfully
          </div>
        </div>
        <form onSubmit={onBack} action='#'>
          <div className='font-medium'>
            <div className="space-y-4 text-center mt-8">
              
            </div>
          </div>
          <button
            className={`success-button mt-4`}
            onClick={onViewOrder}
          >
            <FontAwesomeIcon icon={faEye} size='lg' className='mr-1' />
            View
          </button>
          <button
            className={`back-button mt-4`}
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
