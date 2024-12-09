import { useEffect, useState } from 'react';
import { User } from '../types/models';
import { getUsersSortedByFika, updateUser } from '../firebase/db';
import { Timestamp } from 'firebase/firestore';

export default function Statistics() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const sortedUsers = await getUsersSortedByFika();
    const sortedByFikaCount = [...sortedUsers].sort((a, b) => (b.fikaCount || 0) - (a.fikaCount || 0));
    setUsers(sortedByFikaCount);
  };

  const handleResetStats = async () => {
    const updatedUsers = users.map(user => ({
      ...user,
      fikaCount: 0,
      lastFikaDate: null
    }));
    
    // Update each user
    for (const user of updatedUsers) {
      await updateUser(user);
    }
    
    await fetchUsers();
  };

  const formatLastFikaDate = (user: User): string => {
    if (!user.lastFikaDate) return 'Aldrig';
    else return new Date((user.lastFikaDate as unknown as Timestamp).toDate()).toLocaleDateString('sv-SE');
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-center">STATISTIK</h1>
        <button 
          onClick={handleResetStats}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
        >
          Nollställ statistik
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Namn</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Antal fikor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Senaste fika</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.fikaCount || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatLastFikaDate(user)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
