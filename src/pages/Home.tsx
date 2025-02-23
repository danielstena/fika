import { useState, useEffect } from 'react';
import { getUsers } from '../firebase/db';
import { User } from '../types/models';
import  Statistics  from './Statistics';
import LastSelectedUser from '../components/LastSelectedUser';
import Wheel from '../components/Wheel';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);

  const loadUsers = async () => {
    const fetchedUsers = await getUsers();
    setUsers(fetchedUsers);
  };
  useEffect(() => {
    loadUsers();
  }, []);


  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <LastSelectedUser users={users} />
      <Wheel onRefresh={loadUsers} setIsSpinning={setIsSpinning} isSpinning={isSpinning} />
      
      {!isSpinning && (
        <div className="w-full flex justify-center items-center">
          <Statistics />
        </div>
      )}
    </div>
  );
}
