import { useState, useEffect } from 'react';
import { getUsers, updateUser } from '../firebase/db';
import { User } from '../types/models';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [fikaHost, setFikaHost] = useState<User | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [overrideFriday, setOverrideFriday] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    };
    loadUsers();
  }, []);

  const checkIfFriday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    return dayOfWeek === 5;
  }

  const selectNextFikaHost = () => {
    if (users.length === 0) return null;

    const weights = users.map(user => {
      const fikaCount = user.fikaCount || 0;
      
      let daysSinceLastFika = 365;
      if (user.lastFikaDate) {
        const lastFikaDate = 'toDate' in user.lastFikaDate 
          ? (user.lastFikaDate as { toDate(): Date }).toDate() 
          : new Date(user.lastFikaDate);
        if (lastFikaDate instanceof Date && !isNaN(lastFikaDate.getTime())) {
          daysSinceLastFika = Math.max(1, (new Date().getTime() - lastFikaDate.getTime()) / (1000 * 3600 * 24));
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

  const handleFikaSelection = async () => {
    setIsSpinning(true);
    const nextFikaHost = selectNextFikaHost();
    
    // Slumpmässig väntetid mellan 3000 och 8000 millisekunder
    const randomDelay = Math.floor(Math.random() * (8000 - 3000 + 1) + 3000);
    
    setTimeout(async () => {
      if (nextFikaHost) {
        setFikaHost(nextFikaHost);
        const updatedUser = {
          ...nextFikaHost,
          lastFikaDate: new Date(),
          fikaCount: (nextFikaHost.fikaCount || 0) + 1
        };

        try {
          await updateUser(updatedUser);
          setUsers(users.map(user => 
            user.id === updatedUser.id ? updatedUser : user
          ));
        } catch (error) {
          console.error('Failed to update fika host:', error);
        }
      }
      setIsSpinning(false);
    }, randomDelay);
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {isSpinning ? (
        <div style={{
          fontSize: '120px',
          animation: 'spin 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '200px',
          height: '200px',
        }}>
          🎲
        </div>
      ) : fikaHost ? (
        <div style={{
          fontSize: '64px',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {fikaHost.name}
        </div>
      ) : (
        <>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '18px',
            color: '#1a237e'
          }}>
            <input
              type="checkbox"
              checked={overrideFriday}
              onChange={(e) => setOverrideFriday(e.target.checked)}
            />
            Override Friday check
          </label>
          <button 
            style={{
              padding: '60px 120px',
              fontSize: '64px',
              backgroundColor: '#1a237e',
              color: '#90CAF9',
              border: 'none',
              borderRadius: '32px',
              cursor: (checkIfFriday() || overrideFriday) ? 'pointer' : 'not-allowed',
              boxShadow: '0 8px 24px rgba(13, 71, 161, 0.4)',
              transition: 'all 0.3s ease',
              opacity: (checkIfFriday() || overrideFriday) ? 1 : 0.5,
              background: 'linear-gradient(135deg, #283593, #1a237e)',
              textShadow: '2px 2px 6px rgba(0,0,0,0.3)',
              fontWeight: 'bold',
            }}
            disabled={!(checkIfFriday() || overrideFriday) || isSpinning}
            onMouseEnter={(e) => {
              if (checkIfFriday() || overrideFriday) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(13, 71, 161, 0.6)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #1a237e, #0d47a1)';
                e.currentTarget.style.color = '#E3F2FD';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '';
              e.currentTarget.style.background = '';
              e.currentTarget.style.color = '';
            }}
            onClick={handleFikaSelection}
          >
            SPINN THE WHEEL
          </button>
        </>
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
    </div>
  );
}
