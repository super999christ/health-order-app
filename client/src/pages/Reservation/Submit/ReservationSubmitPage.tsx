import { faArrowLeft } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LogoIcon from '@root/assets/images/logo.png';
import { LogoutButton } from '@root/components/LogoutButton';
import Spinner from '@root/components/Spinner';
import { useAuthContext } from '@root/hooks/useAuthContext';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

export interface IReservationRequest {
  FACILITYID: string;
  RESERVEDBY: string;
  TECHONLY: boolean;
  COMMENTS: string;
  REQSTART: string;
  REQEND: string;
  CASEDATE: string;
  SCHEDULERPHONE: string;
  PROCEDUREID: string;
  DOCTORID: string;
  SCHEDULER: string;
};

export default function ReservationSubmitPage() {
  const [isProcessing, setProcessing] = useState(false);
  const { username } = useAuthContext();
  const { register, getValues, setValue, handleSubmit, setError, formState: { errors } } = useForm<IReservationRequest>({
    defaultValues: {
      FACILITYID: '5670',
      RESERVEDBY: username,
      TECHONLY: false,
      COMMENTS: ""
    }
  });

  const onSubmit = () => {

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
        <form onSubmit={handleSubmit(onSubmit)} action='#'>
          <div className='font-medium'>
            <div className="space-y-4 text-left mt-8">
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Select Date For New Reservation
                  </label>
                  <input
                    className={`input-field !bg-gray-50`}
                    type="text"
                    
                  />
                </div>
                <div className='flex flex-1 gap-2'>
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
              </div>
              <div className="flex gap-6">
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
              <div className="flex gap-6">
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
              <div className="flex gap-6">
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
              <div className="flex gap-6">
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
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Comment
                  </label>
                  <textarea
                    className={`textarea-field !bg-gray-50`}
                    readOnly={true}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='flex justify-between mt-4'>
            <Link to="/reservation/calendar" className='flex items-center gap-1 text-md'>
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
