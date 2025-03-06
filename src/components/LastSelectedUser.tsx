import { User } from '../types/models';
import { Timestamp } from 'firebase/firestore';
import { sortUsersByLastFikaDate } from '../utils/dateHelpers';

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

const userListStyle = {
  display: 'flex',
  marginLeft: 'auto',
  marginRight: 'auto',
  flexDirection: 'column' as const,
  gap: '8px',
  width: '70%'
};

const userItemStyle = {
  fontSize: '18px',
  padding: '8px',
  border: '1px solid rgba(26, 35, 126, 0.15)',
  borderRadius: '8px',
  color: '#1a237e',
  background: 'rgba(255, 255, 255, 0.5)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const dateStyle = {
  fontSize: '14px',
  color: '#666',
  fontStyle: 'italic'
};

export default function LastSelectedUser({ users }: LastSelectedUserProps) {
  const formatDate = (date: Date | null): string => {
    if (!date) return 'Inget datum';
    return date.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const sortedUsers = sortUsersByLastFikaDate(users, 3);

  return (
    <section style={containerStyle}>
      <h2 style={titleStyle}>Three last fika hosts</h2>
      <div style={userListStyle}>
        {sortedUsers.map((user) => (
          <div key={user.id} style={userItemStyle}>
            <span>{user.name}</span>
            <span style={dateStyle}>
              {formatDate(user.lastFikaDate instanceof Timestamp 
                ? user.lastFikaDate.toDate() 
                : user.lastFikaDate)}
            </span>
          </div>
        )) || 'Ingen vald än'}
      </div>
    </section>
  );
} 