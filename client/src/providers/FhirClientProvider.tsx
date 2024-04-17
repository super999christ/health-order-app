import Environment from '@root/constants/base';
import HomePage from '@root/pages/HomePage';
import { IEncounter, IFhirClientContextProps, IFhirClientMeta, IPatient } from '@root/types/fhir.type';
import { oauth2 as SMART } from 'fhirclient';
import Client from 'fhirclient/lib/Client';
import { PropsWithChildren, createContext, useEffect, useState } from 'react';
import { Nullable } from 'vitest';

export const oauth2 = () => {
  localStorage.clear();
  sessionStorage.clear();
  return SMART.authorize({
    clientId: Environment.FHIR_CLIENT_ID,
    scope: "launch encounter/read launch/smart_style_url launch/patient openid fhirUser user/*.* patient/read offline_access",
    redirectUri: "./splash",
    iss: "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4",
    completeInTarget: true
  });
};

export const FhirClientContext = createContext<IFhirClientContextProps>({
  fhirClient: null,
  isFhirLoggedIn: false,
  patient: null,
  encounter: null,
  meta: null
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
  const [meta, setMeta] = useState<Nullable<IFhirClientMeta>>(null);

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
        });
      setMeta({
        facilityCode: fhirClient.getState("tokenResponse.facility") || 'GHS',
        department: fhirClient.getState("tokenResponse.department") || "KHMRG",
        firstName: fhirClient.getState("tokenResponse.userFname") || "User",
        lastName: fhirClient.getState("tokenResponse.userLname") || "Name",
      });
    }
  }, [fhirClient]);

  return (
    <FhirClientContext.Provider value={{ fhirClient, isFhirLoggedIn: !!fhirClient, patient, encounter, meta }}>
      {fhirClient ? children : <HomePage />}
    </FhirClientContext.Provider>
  );
};
