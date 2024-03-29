import { faWarning } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, PropsWithChildren } from "react";

interface IAlertProps {
  color: 'success' | 'primary' | 'danger' | 'warning';
  className?: string;
};

export const Alert: FC<PropsWithChildren<IAlertProps>> = ({ children, color, className }) => {
  return (
    <div className={`text-amber-900 text-sm gap-1 flex justify-center text-center items-center ${color === 'primary' && 'bg-blue-500'} ${color === 'danger' && 'bg-red-500'} ${color === 'success' && 'bg-green-500'} ${color === 'warning' && 'bg-yellow-100'} p-2 ${className}`}>
      <FontAwesomeIcon icon={faWarning} />
      {children}
    </div>
  )
};