import { useState, useEffect } from 'react';
import { getUsers, updateUser } from '../firebase/db';
import { User } from '../types/models';
import  Statistics  from './Statistics';
import FikaWheel from '../components/FikaWheel';
import LastSelectedUser from '../components/LastSelectedUser';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [fikaHost, setFikaHost] = useState<User | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    };
    loadUsers();
  }, []);

  const handleFikaSelection = async (nextFikaHost: User) => {
    setIsSpinning(true);
    const randomDelay = Math.floor(Math.random() * (8000 - 3000 + 1) + 3000);
    
    setTimeout(async () => {
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
      
      setIsSpinning(false);
    }, randomDelay);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <LastSelectedUser users={users} />
      <FikaWheel 
        users={users}
        isSpinning={isSpinning}
        fikaHost={fikaHost}
        onSelectFikaHost={handleFikaSelection}
        overrideFriday={false}
      />
      
      {!isSpinning && (
        <div className="w-full flex justify-center items-center">
          <Statistics />
        </div>
      )}
    </div>
  );
}
