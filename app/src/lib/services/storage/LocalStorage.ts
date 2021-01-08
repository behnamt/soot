import { IKeyValueStorage } from '../../../@types/IKeyValueStorage.types';

export default class LocalStorage implements IKeyValueStorage {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public storage: any;

  constructor() {
    this.storage = window.localStorage;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getItem(key: string): any {
    return JSON.parse(this.storage.getItem(key));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async setItem(key: string, value: Record<string, any>): Promise<void> {
    this.storage.setItem(key, JSON.stringify(value));
  }
}
