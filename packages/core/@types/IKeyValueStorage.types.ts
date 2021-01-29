export interface IKeyValueStorage {
  getItem(key: string): any;
  setItem(key: string, value: any): void;
}
