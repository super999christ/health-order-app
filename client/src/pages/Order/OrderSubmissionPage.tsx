import { faAngleLeft } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LogoIcon from '@root/assets/images/logo.png';
import { LogoutButton } from '@root/components/LogoutButton';
import Spinner from '@root/components/Spinner';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';

export default function OrderSubmissionPage() {
  const [isProcessing, setProcessing] = useState(false);
  const navigate = useNavigate();
  
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProcessing(true);
  };

  const onBack = () => {
    navigate('/order/list');
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
                    disabled={isProcessing}
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
                    disabled={isProcessing}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Equipment Device Name
                  </label>
                  <select className={`input-field`} disabled={isProcessing}>
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
                    disabled={isProcessing}
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
