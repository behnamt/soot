import { ILocation } from './IPosition';

export interface IFullIncident extends ILocation {
  author: string;
  cid: string;
  date: string;
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
  name: string;
}

export interface IFormattedDBIncident extends Omit<IDBIncident, "date"> {
  date: string;
}

export interface IReport extends ILocation {
  name: string;
  description: string;
  isEncrypted: boolean;
}
