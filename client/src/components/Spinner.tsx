import { faSpinnerThird } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ISpinnerProps {
  size?: 'sm' | 'lg';
}

export default function Spinner({ size }: ISpinnerProps) {
  return (
    <FontAwesomeIcon icon={faSpinnerThird} spin fontSize={size === 'lg' ? 55 : 20} className="mx-1 text-gray-400" />
  );
}
