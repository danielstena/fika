import { createUser, getUsers, deleteUser } from '../firebase/db';
import { useState, useEffect } from 'react';

export default function Team() {
  const [users, setUsers] = useState<any[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const allUsers = await getUsers();
    setUsers(allUsers);
  };

  const handleCreateUser = async () => {
    if (!name.trim()) return;
    
    const newUser = {
      name: name,
      createdAt: new Date(),
      fikaCount: 0
    };
    
    await createUser(newUser);
    setName('');  // Reset input
    await fetchUsers();
  };

  const handleDeleteUser = async (userId: string) => {
    await deleteUser(userId);
    await fetchUsers();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Lägg till teammedlem</h1>
      
      <div className="mb-8 flex gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ange namn"
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCreateUser();
            }
          }}
        />
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          onClick={handleCreateUser}
        >
          Lägg till
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">Teammedlemmar</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Namn</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skapad</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Åtgärder</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.createdAt?.toDate().toLocaleDateString('sv-SE')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Radera
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}