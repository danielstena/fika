import { User } from '../types/models';
import { Timestamp } from 'firebase/firestore';

// @ts-ignore
export const getDateFromFikaDate = (fikaDate: Date | Timestamp | null): Date => {
  if (!fikaDate) return new Date(0);
  return fikaDate instanceof Timestamp ? fikaDate.toDate() : fikaDate;
};

export const sortUsersByLastFikaDate = (users: User[], limit?: number): User[] => {
  const sortedUsers = [...users].sort((a, b) => {
    const dateA = getDateFromFikaDate(a.lastFikaDate);
    const dateB = getDateFromFikaDate(b.lastFikaDate);
    return dateB.getTime() - dateA.getTime();
  });

  return limit ? sortedUsers.slice(0, limit) : sortedUsers;
};

export const sortUsersByName = (users: User[], limit?: number): User[] => {
  const sortedUsers = [...users].sort((a, b) => {
    return (a.name || '').localeCompare(b.name || '');
  });
  
  return limit ? sortedUsers.slice(0, limit) : sortedUsers;
}; 