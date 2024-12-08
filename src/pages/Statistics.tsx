import { useEffect, useState } from 'react';
import { User } from '../types/models';
import { getUsersSortedByFika } from '../firebase/db';

export default function Statistics() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const sortedUsers = await getUsersSortedByFika();
      const sortedByFikaCount = [...sortedUsers].sort((a, b) => (b.fikaCount || 0) - (a.fikaCount || 0));
      setUsers(sortedByFikaCount);
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">STATISTIK</h1>
      
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
                  {user.fikaCount > 0
                    ? new Date(user.lastFikaDate?.seconds * 1000).toLocaleDateString('sv-SE')
                    : 'Aldrig'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
