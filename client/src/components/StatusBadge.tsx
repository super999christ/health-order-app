import { ColorMode } from "@root/types/ui.type";
import { PropsWithChildren } from "react";

interface IStatusBadgeProps {
  color?: ColorMode;
}

export const StatusBadge: React.FC<PropsWithChildren<IStatusBadgeProps>> = ({ color, children }) => {
  if (!color)
    color = 'primary';
  const className = {
    primary: 'text-blue-600',
    danger: 'text-red-600',
    warning: 'text-amber-600',
    success: 'text-green-600'
  }
  return (
    <div className={`${className[color]} font-bold`}>
      {children}
    </div>
  )
};