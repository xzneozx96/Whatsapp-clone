export interface User {
  _id: string;
  username: string;
  password?: string;
  refreshToken?: string;
}
