import Spinner from "./Spinner";

export const LoadingBar = () => {
  return (
    <div className="w-full h-full fixed flex justify-center items-center top-0 left-0 bg-white opacity-75 z-50">
      <Spinner size="lg" />
    </div>
  );
};
