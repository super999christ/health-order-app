import { faAngleLeft } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LogoIcon from '@root/assets/images/logo.png';
import { LoadingBar } from '@root/components/LoadingBar';
import { LogoutButton } from '@root/components/LogoutButton';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function OrderViewPage() {
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, []);
  
  const onBack = () => {
    navigate('/order/list');
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
                    Agiliti Site ID
                  </label>
                  <input
                    className={`input-field !bg-gray-50`}
                    type="text"
                    readOnly={true}
                    value={"123456"}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Facility Name
                  </label>
                  <input
                    className={`input-field !bg-gray-50`}
                    type="text"
                    readOnly={true}
                    value={"St Joe Facility XYZ"}
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
                    value={"ED"}
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
                    value={"Randall Christ"}
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
                    value={"F100"}
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
                    value={"25"}
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
                    className="input-field"
                    type="text"
                    placeholder='Your First Name'
                    readOnly={true}
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
                    readOnly={true}
                  />
                </div>
              </div>
              <div className='flex space-x-4'>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`input-field`}
                    type="text"
                    placeholder="1234 1234 1234 1234"
                    readOnly={true}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Equipment Device Name
                  </label>
                  <select className={`input-field`} disabled={isLoading}>
                    <option>Equipment Picker</option>
                    <option>Device 1</option>
                    <option>Device 2</option>
                  </select>
                </div>
              </div>
              <div className='flex space-x-4'>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Comment
                  </label>
                  <textarea
                    className={`textarea-field`}
                    placeholder="Your comment here"
                    readOnly={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
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
