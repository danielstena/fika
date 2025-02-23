import { useState, useEffect } from 'react';

interface User {
  name: string;
}

interface NameSpinnerProps {
  users: User[];
  isSpinning: boolean;
  finalUser: User | null;
  duration: number;
  statistics?: {
    timesSelected: { [key: string]: number };
  };
  lastSelectedUser?: User | null;
}

export default function NameSpinner({ 
  users, 
  isSpinning, 
  finalUser, 
  duration,
  statistics,
  lastSelectedUser 
}: NameSpinnerProps) {
  const [currentName, setCurrentName] = useState('');
  
  useEffect(() => {
    if (!isSpinning) {
      setCurrentName('');
      return;
    }

    const startTime = Date.now();
    let interval: NodeJS.Timeout;
    
    const updateName = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = elapsedTime / duration;
      
      // Öka intervallet gradvis för att sakta ner
      const intervalTime = Math.min(400, Math.floor(50 + progress * 350));
      
      if (progress >= 1) {
        setCurrentName(finalUser?.name || '');
        return;
      }

      const randomUser = users[Math.floor(Math.random() * users.length)];
      setCurrentName(randomUser.name);
      
      interval = setTimeout(updateName, intervalTime);
    };

    interval = setTimeout(updateName, 50);
    return () => clearTimeout(interval);
  }, [isSpinning, users, finalUser, duration]);

  return (
    <div>
      <div style={{
        fontSize: '64px',
        fontWeight: 'bold',
        textAlign: 'center',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#1a237e',
        transition: 'transform 0.1s ease-in-out',
        transform: isSpinning ? 'scale(1.05)' : 'scale(1)'
      }}>
        {currentName || (finalUser?.name ?? '')}
      </div>

      {!isSpinning && statistics && (
        <div className="statistics" style={{ textAlign: 'center', marginTop: '20px' }}>
          <h3>Statistik</h3>
          {Object.entries(statistics.timesSelected).map(([name, count]) => (
            <div key={name}>
              {name}: {count} gånger
            </div>
          ))}
        </div>
      )}

      {!isSpinning && lastSelectedUser && (
        <div className="last-selected" style={{ textAlign: 'center', marginTop: '20px' }}>
          <h3>Senast vald</h3>
          <div>{lastSelectedUser.name}</div>
        </div>
      )}
    </div>
  );
} 