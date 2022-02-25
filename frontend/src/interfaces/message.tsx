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
  createdAt?: string;
}
