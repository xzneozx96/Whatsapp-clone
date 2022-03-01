import { Message } from "./message";

export interface Conversation {
  _id: string;
  members: {
    _id: string;
    username: string;
  }[];
  latestMsg: Message;
  hasMsg: boolean;
  seen?: boolean;
  createdAt: string;
  updatedAt: string;
}
