import { IChatItem, IChatStorage } from '@interfaces/IChat.types';
import storage from './AppStorage.service';
import LocalStorage from './LocalStorage';

class ChatStorage {
  public storage: LocalStorage;

  private readonly chatKey = 'chats';

  constructor() {
    this.storage = storage;
    this.checkChatStorage();
  }

  public async getAllChats(): Promise<IChatItem[]> {
    const storedData: IChatStorage = await this.storage.getItem(this.chatKey);

    return storedData.items;
  }

  public async addChat(report: IChatItem): Promise<void> {
    const storedData: IChatStorage = await this.storage.getItem(this.chatKey);
    storedData.items.push(report);
    this.storage.setItem(this.chatKey, storedData);
  }

  private async createChatStorage(): Promise<void> {
    this.storage.setItem(this.chatKey, {
      items: [],
    });
  }

  private async checkChatStorage(): Promise<boolean> {
    try {
      const storedData = await this.storage.getItem(this.chatKey);

      if (!storedData) {
        throw new Error();
      }

      return true;
    } catch {
      await this.createChatStorage();

      return false;
    }
  }
}

const chatStorage = new ChatStorage();

export default chatStorage;
