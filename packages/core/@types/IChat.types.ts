export interface IChatStorage {
  items: IChatItem[];
}

export interface IChatItem {
  id: string;
  text: string;
  avatar: string;
  address: string;
  date?: string;
}
