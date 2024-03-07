import { HTMLAttributes } from "react";

interface IBulletProps extends HTMLAttributes<HTMLElement> {
  status: 'success' | 'danger' | 'warning' | 'primary';
}

export const Bullet = ({ status, className }: IBulletProps ) => {
  const color = {
    success: 'fill-green-500',
    warning: 'fill-yellow-500',
    danger: 'fill-red-500',
    primary: 'fill-blue-500'
  }
  return (
    <span className={className}>
      <svg className={`h-3 w-3 ${color[status]} inline`} viewBox="0 0 14 14" aria-hidden="true">
        <circle cx={6} cy={6} r={6} />
      </svg>
      <span className="hidden fill-red-500 fill-green-500 fill-yellow-500 fill-blue-500"></span>
    </span>
  )
};