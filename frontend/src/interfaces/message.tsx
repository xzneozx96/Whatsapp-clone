export interface Message {
  _id?: string;
  conversationId: string;
  senderId: string;
  message: string;
  files?: {
    path: string;
    fileType: string;
    fileName: string;
  }[];
  sent?: boolean;
  replyTo?: Message;
  createdAt?: string;
}
