import Environment from '@root/constants/base';
import { oauth2 as SMART } from 'fhirclient';
import Client from 'fhirclient/lib/Client';
import { fhirclient } from 'fhirclient/lib/types';
import { PropsWithChildren, createContext, useEffect, useState } from 'react';
import { Nullable } from 'vitest';

export interface IPatient extends fhirclient.FHIR.Patient {
  name?: {
    use: string;
    text: string;
    family: string;
    given: string[];
  }[];
}

export interface IEncounter extends fhirclient.FHIR.Encounter {}

export interface IFhirClientContextProps {
  fhirClient: Nullable<Client>;
  isFhirLoggedIn: boolean;
  patient: Nullable<IPatient>;
  encounter: Nullable<fhirclient.FHIR.Encounter>;
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
  patient: null,
  encounter: null,
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
  const [patient, setPatient] = useState<Nullable<IPatient>>(null);
  const [encounter, setEncounter] = useState<Nullable<IEncounter>>(null);

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

  useEffect(() => {
    if (fhirClient) {
      fhirClient.patient.read()
        .then(res => {
          setPatient(res);
        })
        .catch(err => {
          console.log("Fhir patient error: ", err);
          oauth2();
        });
      fhirClient.encounter.read()
        .then(res => {
          setEncounter(res);
        }).catch(err => {
          console.log("Fhir encounter error: ", err);
          // oauth2();
        })
    }
  }, [fhirClient]);

  return (
    <FhirClientContext.Provider value={{ fhirClient, isFhirLoggedIn: !!fhirClient, patient, encounter }}>
      {children}
    </FhirClientContext.Provider>
  );
};
