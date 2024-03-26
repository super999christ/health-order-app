export const OrderCard = () => {
  return (
    <div className="max-w-[450px] lg:max-w-[450px] flex flex-col p-5 border border-gray-200 border-solid rounded-2xl drop-shadow-sm bg-gray-50">
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
        <button className='btn-primary w-full'>Open</button>
      </div>
    </div>
  );
}