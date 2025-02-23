export interface User {
  id: string;
  name: string;
  nickname: string;
  createdAt: Date;
  fikaCount?: number;
  lastFikaDate?: Date | any;
  percentage?: number;
}

export interface Team {
  id: string;
  name: string;
  users: User[];
}