import { IKeyValueStorage } from '../../../@types/IKeyValueStorage.types';

export default class LocalStorage implements IKeyValueStorage {
  public storage: any;

  constructor() {
    this.storage = window.localStorage;
  }

  public getItem(key: string): any {
    return JSON.parse(this.storage.getItem(key));
  }

  public async setItem(key: string, value: any): Promise<void> {
    this.storage.setItem(key, JSON.stringify(value));
  }
}
