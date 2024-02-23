import Client from "fhirclient/lib/Client";
import { fhirclient } from "fhirclient/lib/types";
import { Nullable } from "vitest";

export interface IPatient extends fhirclient.FHIR.Patient {
  name?: {
    use: string;
    text: string;
    family: string;
    given: string[];
  }[];
}

export interface IEncounter extends fhirclient.FHIR.Encounter {
  location?: {
    location: {
      display: string;
      reference?: string;
      identifier?: {
        system: string;
        value: string;
      }
    },
    period?: {
      start: string;
    },
    physicalType?: {
      coding: {
        code: string;
        display: string;
        system: string;
      }[];
      text: string;
    }
  }[]
}

export interface IFhirClientContextProps {
  fhirClient: Nullable<Client>;
  isFhirLoggedIn: boolean;
  patient: Nullable<IPatient>;
  encounter: Nullable<IEncounter>;
}
