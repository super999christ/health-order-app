import { faArrowLeft } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LogoIcon from '@root/assets/images/logo.png';
import { LoadingBar } from '@root/components/LoadingBar';
import { LogoutButton } from '@root/components/LogoutButton';
import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ReservationDetailPage() {
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, []);
  
  const onBack = () => {
    navigate('/reservation/calendar');
  };

  const reservation = useMemo(() => {
    try {
      const data = JSON.parse(window.localStorage.getItem("currentReservation") as string);
      return data;
    } catch (err) {
      return null;
    }
  }, []);
  
  return (
    <div className="flex flex-col lg:mt-[80px] md:mt-[50px] lg:mb-8 mx-auto w-fit pl-10 lg:pl-6 pr-6 bg-white border rounded-3xl">
      <LogoutButton />
      {isLoading && <LoadingBar />}
      <div
        className="relative px-4 sm:px-6 lg:px-8 pb-6 md:w-[750px] lg:w-[850px]"
      >
        <div className="text-center mb-4">
          <div className="mb-2">
            <img
              className="mt-4 inline-flex rounded-full"
              src={LogoIcon}
              alt="User"
            />
          </div>
          <h1 className="text-2xl leading-snug font-semibold bg-[#1a75a3] text-white w-full p-2 text-left rounded-sm">
            View Reservation
          </h1>
        </div>
        <form onSubmit={onBack} action='#'>
          <div className='font-medium p-4 rounded-xl border-2 border-solid bg-blue-50'>
            <div className="space-y-6 text-left">
              <div className="flex space-x-4 gap-4">
                <div className='flex-1'>
                  <label className="block text-md font-semibold mb-1">
                    Patient
                  </label>
                  <label className='block text-sm font-normal'>
                    {reservation?.PATIENT}
                  </label>
                </div>
                <div className='flex-1'>
                  <label className="block text-md font-semibold mb-1">
                    Procedure
                  </label>
                  <label className='block text-sm font-normal'>
                    {reservation?.PROCEDURE}
                  </label>
                </div>
              </div>
              <div className="flex space-x-4 gap-4">
                <div className='flex-1'>
                  <label className="block text-md font-semibold mb-1">
                    Reservation Start
                  </label>
                  <label className='block text-sm font-normal'>
                    {reservation?.REQSTART}
                  </label>
                </div>
                <div className='flex-1'>
                  <label className="block text-md font-semibold mb-1">
                    Reservation End
                  </label>
                  <label className='block text-sm font-normal'>
                    {reservation?.REQEND}
                  </label>
                </div>
              </div>
              <div className="flex space-x-4 gap-4">
                <div className='flex-1'>
                  <label className="block text-md font-semibold mb-1">
                    Doctor
                  </label>
                  <label className='block text-sm font-normal'>
                    {reservation?.DOCTOR}
                  </label>
                </div>
                <div className='flex-1'>
                  <label className="block text-md font-semibold mb-1">
                    Facility
                  </label>
                  <label className='block text-sm font-normal'>
                    {reservation?.FACILITY}
                  </label>
                </div>
              </div>
              <div className="flex space-x-4 gap-4">
                <div className='flex-1'>
                  <label className="block text-md font-semibold mb-1">
                    Status
                  </label>
                  <label className='block text-sm font-normal'>
                    {reservation?.STATUS}
                  </label>
                </div>
                <div className='flex-1'>
                  <label className="block text-md font-semibold mb-1">
                    Reservation
                  </label>
                  <label className='block text-sm font-normal'>
                    {reservation?.CASEQCID}
                  </label>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-md font-semibold mb-1">
                    Comments
                  </label>
                  <label className='block text-sm font-normal'>
                    {reservation?.COMMENTS}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className='flex justify-start mt-4 px-2'>
            <Link to="/reservation/calendar" className='flex items-center gap-1 text-md'>
              <FontAwesomeIcon icon={faArrowLeft} />
              View Calendar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
