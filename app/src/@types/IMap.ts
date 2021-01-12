import { ILocation } from './IPosition';

export interface IMark {
  draggable?: boolean;
  name: string;
  id: string;
  location: ILocation;
}

export interface IBingMap {
  entities: string[];
}
