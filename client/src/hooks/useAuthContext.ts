import { AuthContext } from "@root/providers/AuthProvider";
import { useContext } from "react";

export const useAuthContext = () => {
  return useContext(AuthContext);
};