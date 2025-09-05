// client/app/admin/users/page.tsx
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

// ควรย้าย Type ไปไว้ที่ไฟล์กลาง @/types/index.ts
interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error("Failed to fetch users:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (userId: string, username: string) => {
    if (window.confirm(`Are you sure you want to delete user: ${username}?`)) {
      try {
        await api.delete(`/admin/users/${userId}`);
        setUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
        alert('User deleted successfully.');
      } catch (error) {
         console.error("Failed to delete user:", error);
        alert('Failed to delete user.');
      }
    }
  };

  const handleResetPassword = async (userId: string) => {
    const newPassword = window.prompt("Enter new password for the user (min. 6 characters):");
    if (newPassword === null) return; // User cancelled
    if (newPassword.length >= 6) {
      try {
        await api.post(`/admin/users/${userId}/reset-password`, { newPassword });
        alert("Password reset successfully!");
      } catch (error) {
        console.error("Failed to reset password:", error);
        alert("Failed to reset password.");
      }
    } else {
      alert("Password must be at least 6 characters long.");
    }
  };

  if (isLoading) return <p>Loading users...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Username</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-left">Joined Date</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{user.username}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.role}</td>
                <td className="py-2 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="py-2 px-4 text-center space-x-2">
                  <button onClick={() => handleResetPassword(user.id)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                    Reset Pass
                  </button>
                  <button onClick={() => handleDelete(user.id, user.username)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                    Delete
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