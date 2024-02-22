import Environment from '@root/constants/base';
import { oauth2 as SMART } from 'fhirclient';
import Client from 'fhirclient/lib/Client';
import { PropsWithChildren, createContext, useEffect, useState } from 'react';
import { Nullable } from 'vitest';

export interface IFhirClientContextProps {
  fhirClient: Nullable<Client>;
  isFhirLoggedIn: boolean;
}

export const oauth2 = () => {
  return SMART.authorize({
    clientId: Environment.FHIR_CLIENT_ID,
    scope: "launch encounter/read launch/smart_style_url launch/patient openid fhirUser user/*.* patient/read offline_access",
    redirectUri: "./login",
    iss: "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4",
    completeInTarget: true
  });
};

export const FhirClientContext = createContext<IFhirClientContextProps>({
  fhirClient: null,
  isFhirLoggedIn: false,
});

const syncSessionStorage = () => {
  // LocalStorage variables
  const localSmartKey = localStorage.getItem("SMART_KEY") || "";
  const localKey = localSmartKey.slice(1, localSmartKey.length - 1);
  const localSmartState = localStorage.getItem(localKey) || "";
  // SessionStorage variables
  const smartKey = sessionStorage.getItem("SMART_KEY") || "";
  const key = smartKey.slice(1, smartKey.length - 1);
  const smartState = sessionStorage.getItem(key) || "";
  if (smartKey && smartState) {
    // Pushes SessionStorage data -> LocalStorage
    localStorage.setItem("SMART_KEY", smartKey);
    localStorage.setItem(key, smartState);
  } else if (localSmartKey && localSmartState) {
    // Pulls SessionStorage data from LocalStorage
    sessionStorage.setItem("SMART_KEY", localSmartKey);
    sessionStorage.setItem(localKey, localSmartState);
  }
};

export const FhirClientProvider = ({ children }: PropsWithChildren) => {
  const [fhirClient, setFhirClient] = useState<Nullable<Client>>(null);

  useEffect(() => {
    syncSessionStorage();
    SMART.ready().then(client => {
      if (!client.getIdToken()) {
        throw Error("Patient not selected");
      }
      setFhirClient(client);
      console.log({ client });
    }).catch(err => {
      console.log("Fhir authentication error: ", err);
      oauth2();
    });
  }, []);

  return (
    <FhirClientContext.Provider value={{ fhirClient, isFhirLoggedIn: !!fhirClient }}>
      {children}
    </FhirClientContext.Provider>
  );
};
