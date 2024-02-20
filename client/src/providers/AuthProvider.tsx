import Environment from '@root/constants/base';
import { isTokenValid } from '@root/utils/auth';
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useState
} from 'react';

export interface IAuthContextProps {
  isLoggedIn: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
}

export const AuthContext = createContext<IAuthContextProps>({
  isLoggedIn: false,
  setLoggedIn: () => {}
});

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [isLoggedIn, setLoggedIn] = useState(() => {
    const accessToken = localStorage.getItem(Environment.STORAGE.ACCESS_TOKEN) || '';
    return isTokenValid(accessToken);
  });
  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
