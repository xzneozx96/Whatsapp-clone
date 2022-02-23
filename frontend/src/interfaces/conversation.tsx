export interface Conversation {
  _id: string;
  members: {
    _id: string;
    username: string;
  }[];
  createdAt: string;
  updatedAt: string;
  latestMsg: string;
}
