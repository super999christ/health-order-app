import LogoIcon from '@root/assets/images/logo.png';

export default function LoginPage() {
  return (
    <div className='flex flex-col lg:mt-[80px] mx-auto w-fit pl-10 lg:pl-6 pr-6 pb-10 bg-gray-100 border rounded-3xl'>
      <div>
        <img
          className="mx-auto w-auto"
          src={LogoIcon}
          alt="Agility Company"
        />
      </div>
      <div className='flex flex-col lg:flex-row justify-center min-h-full flex-1 lg:gap-10 items-center'>
        <div className="flex flex-col justify-center lg:px-8">
          <div className="sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:w-full sm:max-w-sm">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 text-left">
                  User name
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              Forgot Password?
              <br />
              Please contact the Agiliti Service Desk at (952) 893-3289, Option 1
            </p>
          </div>
        </div>
        <div className="flex flex-col lg:px-8 lg:border-l-[1px] border-l-gray-200">
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