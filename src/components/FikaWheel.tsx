import { User } from '../types/models';
import { Timestamp } from 'firebase/firestore';
import NameSpinner from './NameSpinner';

interface FikaWheelProps {
  users: User[];
  isSpinning: boolean;
  fikaHost: User | null;
  overrideFriday: boolean;
  onSelectFikaHost: (selectedUser: User) => void;
}

export default function FikaWheel({ users, isSpinning, fikaHost, onSelectFikaHost }: FikaWheelProps) {

  const selectNextFikaHost = () => {
    if (users.length === 0) return null;

    const weights = users.map(user => {
      const fikaCount = user.fikaCount || 0;
      
      let daysSinceLastFika = 365;
      if (user.lastFikaDate) {
        if (user.lastFikaDate instanceof Timestamp) {
          const lastFikaDate = user.lastFikaDate.toDate();
          daysSinceLastFika = Math.max(1, (new Date().getTime() - lastFikaDate.getTime()) / (1000 * 3600 * 24));
        } else if (user.lastFikaDate instanceof Date) {
          daysSinceLastFika = Math.max(1, (new Date().getTime() - user.lastFikaDate.getTime()) / (1000 * 3600 * 24));
        }
      }

      const weight = (daysSinceLastFika + 1) / Math.pow(fikaCount + 1, 1.5);
      
      console.log(`${user.name}:`, {
        daysSinceLastFika: Math.round(daysSinceLastFika),
        fikaCount,
        weight: Math.round(weight * 100) / 100,
        lastFikaDate: user.lastFikaDate
      });

      return weight;
    });

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const random = Math.random() * totalWeight;
    
    let accumulator = 0;
    for (let i = 0; i < weights.length; i++) {
      accumulator += weights[i];
      if (random <= accumulator) {
        return users[i];
      }
    }

    return users[0];
  };

  const handleFikaSelection = () => {
    const nextFikaHost = selectNextFikaHost();
    if (nextFikaHost) {
      onSelectFikaHost(nextFikaHost);
    }
  };

  return (
    <>
      {isSpinning || fikaHost ? (
        <NameSpinner 
          users={users}
          isSpinning={isSpinning}
          finalUser={fikaHost}
          duration={8000}
        />
      ) : (
        <div>
          <button 
            style={{
              marginTop: '20px',
              marginBottom: '20px',
              padding: '60px 120px',
              fontSize: '64px',
              backgroundColor: '#1a237e',
              color: '#E3F2FD',
              border: 'none',
              borderRadius: '32px',
              cursor: 'pointer',
              boxShadow: '0 12px 32px rgba(13, 71, 161, 0.6)',
              background: 'linear-gradient(135deg, #1a237e, #0d47a1)',
              textShadow: '2px 2px 6px rgba(0,0,0,0.3)',
              fontWeight: 'bold',
            }}
            disabled={isSpinning}
            onClick={handleFikaSelection}
          >
            GET THE FIKA HOST
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { 
            transform: rotate(0deg) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: rotate(180deg) scale(1.2);
            opacity: 1;
          }
          to { 
            transform: rotate(360deg) scale(1);
            opacity: 0.5;
          }
        }
      `}</style>
    </>
  );
} 