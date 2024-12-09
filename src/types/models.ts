import { FieldValue } from 'firebase/firestore';

export interface User {
  id: string;
  name: string;
  createdAt: Date;
  fikaCount?: number;
  lastFikaDate?: Date | FieldValue;
}