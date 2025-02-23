declare module 'firebase/firestore';
declare module 'firebase/auth';
declare module 'firebase/app';

declare module 'firebase/firestore' {
  export class Timestamp {
    seconds: number;
    nanoseconds: number;
    toDate(): Date;
  }
} 