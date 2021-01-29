import { ILocation } from './IPosition';

export interface IFullIncident extends ILocation {
  name: string;
  cid: string;
  date: string;
  isEncrypted: boolean;
  author: string;
}

export interface IIncidentEvent extends ILocation {
  id: string;
  name: string;
  cid: string;
  date: string;
  isEncrypted: boolean;
}

export interface IIncident extends ILocation {
  id: string;
  name: string;
  isEncrypted: boolean;
}

export interface IReport extends ILocation {
  name: string;
  description: string;
  isEncrypted: boolean;
}
