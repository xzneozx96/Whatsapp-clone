export interface Conversation {
  _id: string;
  members: {
    userId: string;
    username: string;
  }[];
  createdAt: string;
  updatedAt: string;
  latestMsg: string;
}
