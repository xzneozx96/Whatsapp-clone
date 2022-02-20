export interface Message {
  _id?: string;
  conversationId: string;
  senderId: string;
  message: string;
  createdAt: string;
}
