import { FhirClientContext } from "@root/providers/FhirClientProvider";
import { useContext } from "react";

export const useFhirContext = () => {
  return useContext(FhirClientContext);
};