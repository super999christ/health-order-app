import { faPlus, faSearch } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LogoIcon from '@root/assets/images/logo.png';
import { LogoutButton } from '@root/components/LogoutButton';
import { useNavigate } from 'react-router';

export default function OrderListPage() {
  const navigate = useNavigate();
  
  const onOpenOrder = () => {
    navigate('/order/view');
  };

  const onNewOrder = () => {
    navigate('/order/submit');
  };

  return (
    <div className="flex flex-col lg:mt-[80px] mb-8 mx-auto w-fit p-6 bg-white border rounded-3xl max-w-[1050px]">
      <LogoutButton />
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="mb-2">
            <img
              className="mt-4 inline-flex rounded-full"
              src={LogoIcon}
              alt="User"
            />
          </div>
          <h1 className="text-2xl leading-snug text-gray-800 font-semibold mb-2">
            Explore Orders
          </h1>
          <div className="text-sm lg:max-w-[650px]">
            Browse and discover existing healthcare orders quickly and easily.
            Search past orders by patient, date, doctor or type of order to find
            the details you need.
          </div>
        </div>
      </div>
      <div className='flex flex-col sm:px-8'>
        <div className="w-full flex gap-2">
          <div className='flex-1'>
            <label className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} size='sm' />
              </div>
              <input type="search" className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50" placeholder="Search orders" required />
              <button type="submit" className="text-white absolute end-2.5 bottom-[6px] bg-amber-700 hover:bg-amber-800 focus:outline-none font-medium rounded-lg text-sm px-4 py-1.5">Search</button>
            </div>
          </div>
          <div className='flex items-center'>
            <button type="button" className='order-button h-5/6 min-w-[120px] flex gap-1' onClick={onNewOrder}>
              <FontAwesomeIcon icon={faPlus} size='lg' />
              New Order
            </button>
          </div>
        </div>
        <div className='flex flex-wrap justify-center lg:justify-around items-center gap-6 mt-4'>
          {[0, 1, 2, 3].map((value) => (
            <div key={value} className="max-w-[450px] lg:max-w-[450px] flex flex-col p-5 border border-gray-200 border-solid rounded-2xl drop-shadow-sm bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="flex-none w-[68px] h-[68px] bg-red rounded-full flex justify-center items-center bg-purple-700 text-white text-[24px]">
                  RC
                </div>
                <div className="flex gap-2 flex-wrap flex-row gap-x-6 gap-y-2">
                  <div className="text-gray-500 font-normal">
                    Order Number
                    <div className="text-black">#1210</div>
                  </div>
                  <div className="text-gray-500 font-normal">
                    Patient Name
                    <div className="text-black">Randall Christ</div>
                  </div>
                  <div className="text-gray-500 font-normal w-fit">
                    Status
                    <div className="rounded-md bg-blue-500/10 px-2 py-1 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20">
                      Open
                    </div>
                  </div>
                  <div className="text-gray-500 font-normal">
                    Last Update
                    <div className="text-black">
                      Nov 11th, 2019 at 3:27 PM
                    </div>
                  </div>
                  <div className="text-gray-500 font-normal">
                    Hospital
                    <div className="text-black">Floor | 102 |</div>
                  </div>
                </div>
              </div>
              <hr className="my-2" />
              <div className="flex gap-4">
                <div className="text-gray-500 text-md px-2 break-all">
                  This order requests an x-ray of the left shoulder to evaluate pain
                  reported after a fall.
                </div>
              </div>
              <div className='flex justify-end'>
                <button className='open-button' onClick={() => onOpenOrder()}>Open</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
