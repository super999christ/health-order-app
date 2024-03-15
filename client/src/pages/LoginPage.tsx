import { login } from '@root/apis/login';
import LogoIcon from '@root/assets/images/logo.png';
import Spinner from '@root/components/Spinner';
import Environment from '@root/constants/base';
import { useAuthContext } from '@root/hooks/useAuthContext';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';

export default function LoginPage() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isProcessing, setProcessing] = useState(false);
  const { setLoggedIn } = useAuthContext();
  const navigate = useNavigate();
  
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setProcessing(true);
      const { data } = await login(userName, password);
      const { accessToken, refreshToken } = data;
      localStorage.setItem(Environment.STORAGE.ACCESS_TOKEN, accessToken);
      localStorage.setItem(Environment.STORAGE.REFRESH_TOKEN, refreshToken);
      setLoggedIn(true);
      setTimeout(() => {
        navigate('/order/submit');
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setProcessing(false);
    }
  };

  const onUserNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const onPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div className='flex flex-col lg:mt-[80px] mx-auto w-fit pl-10 lg:pl-6 pr-6 pb-10 bg-white border rounded-3xl'>
      <div className='mt-4'>
        <img
          className="mx-auto w-auto"
          src={LogoIcon}
          alt="Agility Company"
        />
      </div>
      <div className='flex flex-col lg:flex-row justify-center min-h-full flex-1 lg:gap-10 items-center items-baseline'>
        <div className="flex flex-col justify-center lg:px-8">
          <div className="sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={onSubmit} action='#'>
              <div>
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 text-left">
                  User name
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    required
                    className={`input-field bg-white`}
                    onChange={onUserNameChange}
                    disabled={isProcessing}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className={`input-field bg-white`}
                    onChange={onPasswordChange}
                    disabled={isProcessing}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="default-button"
                disabled={isProcessing}
              >
                {isProcessing && <Spinner />}
                Sign in
              </button>
              {error && (
                <div className='error !mt-4'>
                  The username or password you entered is invalid.
                </div>
              )}
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              Forgot Password?
              <br />
              Please contact the Agiliti Service Desk at (952) 893-3289, Option 1
            </p>
          </div>
        </div>
        <div className="flex flex-col lg:px-8 lg:border-l-[1px] border-l-gray-200 self-baseline">
          <div className="w-full max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-700 underline underline-offset-8">
              Register
            </h2>
            <ul className='text-left list-disc mt-3 flex flex-col gap-4'>
              <li>Schedule new cases online</li>
              <li>View or change future cases</li>
              <li>Receive case confirmation via email</li>
              <li>Secure and easy to use</li>
              <li>Available 24/7</li>
            </ul>
            <div className='text-left mt-5 lg:mt-[80px] lg:ml-[-16px]'>
              <span className='text-blue-600 underline'>Contact Us</span> today to register or schedule your free demonstration.
              <br />
              Phone: 800.660.6162, Option 1
              <br />
              Email: scheduling.surgical@agilitihealth.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}