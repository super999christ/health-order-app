import Spinner from "./Spinner";

export const LoadingOverlay = () => {
  return (
    <div className="w-full h-full fixed block top-0 left-0 bg-white opacity-75 z-50">
      <span className="opacity-75 top-1/2 my-0 mx-auto block relative w-0 h-0">
        <Spinner size="lg" />
      </span>
    </div>
  )
};