import { ILocation } from './IPosition';

export interface IFullIncident extends ILocation {
  author: string;
  cid: string;
  date: string;
  isEncrypted: boolean;
  name: string;
}

export interface IIncidentEvent extends ILocation {
  cid: string;
  date: string;
  id: string;
  isEncrypted: boolean;
  name: string;
}
export interface IDBIncident extends ILocation {
  id: string;
  date: number;
  author: string;
  description: string;
  latitude: number;
  longitude: number;
}

export interface IReport extends ILocation {
  name: string;
  description: string;
  isEncrypted: boolean;
}
