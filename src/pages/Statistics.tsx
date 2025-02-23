import { useEffect, useState } from 'react';
import { User } from '../types/models';
import { getUsersSortedByFika } from '../firebase/db';

export default function Statistics() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);


  const getPercentageOfFikas = (user: User): number => {
    const totalFikas = users.reduce((acc, curr) => acc + (curr.fikaCount || 0), 0);
    return (user.fikaCount || 0) / totalFikas;
  };

  const fetchUsers = async () => {
    let sortedUsers = await getUsersSortedByFika();
    const percentages = sortedUsers.map((user: User) => getPercentageOfFikas(user));
    
    sortedUsers = sortedUsers.map((user: User, index: number) => ({
      ...user,
      percentage: percentages[index]
    }));

    const sortedByFikaCount = [...sortedUsers].sort((a, b) => (b.fikaCount || 0) - (a.fikaCount || 0));

    setUsers(sortedByFikaCount);
  };
  const formatLastFikaDate = (user: User): string => {
    if (!user.lastFikaDate) return 'Never';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    else return new Date((user.lastFikaDate as any).toDate()).toLocaleDateString('sv-SE');
  };

  return (
    <div className="p-4 w-full justify-center items-center">
      
      <div className="w-full">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nickname</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">active</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Number of fikas</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Latest fika</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-center">{user?.nickname}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{user?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{user?.active ? 'Yes' : 'No'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{user?.fikaCount || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
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
