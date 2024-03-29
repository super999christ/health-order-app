import type { FC, PropsWithChildren } from 'react';

const ErrorText: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={`text-sm text-left text-red-700 ${children ? 'my-2' : ''}`}>
      {children}
    </div>
  );
};

export default ErrorText;
