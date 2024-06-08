import LogoIcon from '@root/assets/images/logo.png';
import Spinner from '@root/components/Spinner';

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center h-full pb-[20vh]">
      <img src={LogoIcon} alt="Logo" />
      <div className='font-semibold text-[36px] mb-4 text-gray-700'>Ordering Apps</div>
      <Spinner size='lg' />
    </div>
  );
}