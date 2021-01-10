export interface IMark {
  draggable?: boolean;
  name: string;
  id: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface IBingMap {
  entities: string[];
}
