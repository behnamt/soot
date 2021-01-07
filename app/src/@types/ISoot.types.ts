export interface IFullIncident {
  name: string;
  lat: number;
  lon: number;
  cid: string;
  date: string;
  isEncrypted: boolean;
  author: string;
}

export interface IIncidentEvent {
  id: string;
  name: string;
  lat: number;
  lon: number;
  cid: string;
  date: string;
  isEncrypted: boolean;
}

export interface IIncident {
  id: string;
  name: string;
  lat: number;
  lon: number;
  isEncrypted: boolean;
}

export interface IReport {
  name: string;
  description: string;
  lat: number;
  lon: number;
  isEncrypted: boolean;
}
