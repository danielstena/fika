import { User } from '../types/models';
import { Timestamp } from 'firebase/firestore';

interface LastSelectedUserProps {
  users: User[];
}

const containerStyle = {
  width: '100%',
  marginTop: '24px',
  padding: '24px',
  background: 'linear-gradient(145deg, rgba(26, 35, 126, 0.08), rgba(26, 35, 126, 0.12))',
  borderRadius: '20px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  textAlign: 'center' as const,
  border: '1px solid rgba(26, 35, 126, 0.15)'
};

const titleStyle = {
  fontSize: '16px',
  fontWeight: 500,
  color: '#1a237e',
  marginBottom: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px'
};

const userNameStyle = {
  fontSize: '20px',
  fontWeight: 600,
  color: '#1a237e'
};

export default function LastSelectedUser({ users }: LastSelectedUserProps) {
  return (
    <section style={containerStyle}>
      <h2 style={titleStyle}>Last selected fika host</h2>
      <div style={userNameStyle}>
        {users
          .sort((a, b) => {
            const dateA = a.lastFikaDate ? 
              (a.lastFikaDate instanceof Timestamp ? a.lastFikaDate.toDate() : a.lastFikaDate) : 
              new Date(0);
            const dateB = b.lastFikaDate ? 
              (b.lastFikaDate instanceof Timestamp ? b.lastFikaDate.toDate() : b.lastFikaDate) : 
              new Date(0);
            return dateB.getTime() - dateA.getTime();
          })[0]?.name || 'Ingen vald än'}
      </div>
    </section>
  );
} 