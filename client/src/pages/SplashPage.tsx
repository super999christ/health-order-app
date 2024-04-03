import { faExternalLink } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LogoIcon from '@root/assets/images/logo.png';
import { LogoutButton } from '@root/components/LogoutButton';
import { Link } from 'react-router-dom';

const apps = [
  {
    id: 'order_app',
    name: 'Ordering App',
    href: '/order/list',
  },
  {
    id: 'reservation_app',
    name: 'Reservation App',
    href: '/login',
  }
];

export default function SplashPage() {
  return (
    <div className='flex flex-col lg:mt-[80px] mx-auto w-fit pl-10 lg:pl-6 pr-6 pb-10 bg-white border rounded-3xl lg:w-[850px]'>
      <LogoutButton />
      <div className="text-center mb-6">
        <div className="mb-4">
          <img
            className="mt-4 inline-flex rounded-full"
            src={LogoIcon}
            alt="User"
          />
        </div>
        <h1 className="text-2xl leading-snug font-semibold bg-[#0aa069] text-white w-full p-2 text-left rounded-sm">
          Get Started With Agiliti Apps
        </h1>
      </div>
      <div className='flex flex-col gap-4'>
        {apps.map(app => (
          <div className='bg-white p-4 rounded-xl' key={app.id}>
            <div className='flex justify-between'>
              <div className="text-[20px]">{app.name}</div>
              <Link to={app.href} className='btn-success !text-white flex items-center gap-1'>
                <span>OPEN THE APP</span>
                <FontAwesomeIcon icon={faExternalLink} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}