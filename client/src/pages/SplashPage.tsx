import { faExternalLink } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LogoIcon from '@root/assets/images/logo.png';
import { LogoutButton } from '@root/components/LogoutButton';
import { useFhirContext } from '@root/hooks/useFhirContext';
import { IUserAccess } from '@root/types/fhir.type';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

const apps = [
  {
    id: 'order_app',
    name: 'Equipment Ordering App',
    href: '/order/list',
  },
  {
    id: 'reservation_app',
    name: 'Surgical Scheduling App',
    href: '/login',
  }
];

const getAccessibleApps = (userAccess: IUserAccess) => {
  switch (userAccess) {
    case 'order':
      return [apps[0]];
    case 'scheduler':
      return [apps[1]];
    case 'full':
      return [apps[0], apps[1]];
  }
  return [];
};

export default function SplashPage() {
  const { userAccess } = useFhirContext();
  
  const accessibleApps = useMemo(() => {
    return getAccessibleApps(userAccess);
  }, [userAccess]);

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
        <h1 className="text-2xl leading-snug font-semibold bg-[#01426A] text-white w-full p-2 text-left rounded-sm">
          Get Started With Agiliti Apps
        </h1>
      </div>
      <div className='flex flex-col gap-4'>
        {accessibleApps.map(app => (
          <div className='bg-white p-4 rounded-xl' key={app.id}>
            <div className='flex justify-between'>
              <div className="text-[20px]">{app.name}</div>
              <Link to={app.href} className='btn-agiliti-orange !text-white flex items-center gap-1'>
                <span>OPEN THE APP</span>
                <FontAwesomeIcon icon={faExternalLink} />
              </Link>
            </div>
          </div>
        ))}
        {!accessibleApps.length && (
          <div className='text-xl'>User has no access to Agiliti apps</div>
        )}
      </div>
    </div>
  );
}