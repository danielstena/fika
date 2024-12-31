import { FieldValue } from 'firebase/firestore';

export interface User {
  id: string;
  name: string;
  createdAt: Date;
  fikaCount?: number;
  lastFikaDate?: Date | FieldValue;
}

export interface Team {
  id: string;
  name: string;
  users: User[];
}