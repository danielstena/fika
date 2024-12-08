export interface User {
  id: string;
  name: string;
  createdAt: Date;
  lastFikaDate?: Date;
  fikaCount: number;
}