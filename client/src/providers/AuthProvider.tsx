import Environment from '@root/constants/base';
import { isTokenValid, refreshTokenRotate, getUsername } from '@root/utils/auth';
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
  useState
} from 'react';

export interface IAuthContextProps {
  isLoggedIn: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
  username: string;
}

export const AuthContext = createContext<IAuthContextProps>({
  isLoggedIn: false,
  setLoggedIn: () => {},
  username: ''
});

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [isLoggedIn, setLoggedIn] = useState(() => {
    const accessToken = localStorage.getItem(Environment.STORAGE.ACCESS_TOKEN) || '';
    return isTokenValid(accessToken);
  });
  const [accessToken, setAccessToken] = useState(localStorage.getItem(Environment.STORAGE.ACCESS_TOKEN) || '');
  const [refreshToken] = useState(localStorage.getItem(Environment.STORAGE.REFRESH_TOKEN) || '');
  const username = useMemo(() => getUsername(accessToken), [accessToken]);

  useEffect(() => {
    if (isTokenValid(accessToken) && isTokenValid(refreshToken)) {
      const timer = setInterval(forceReloadToken, 30 * 1000);
      return () => clearInterval(timer);
    }
  }, [accessToken, refreshToken]);

  const forceReloadToken = async () => {
    try {
      const res = await refreshTokenRotate(refreshToken);
      setAccessToken(res.token);
      localStorage.setItem(Environment.STORAGE.ACCESS_TOKEN, res.token);
    } catch (err) {
      console.log("Error while reloading token: ", err);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn, username }}>
      {children}
    </AuthContext.Provider>
  );
};
