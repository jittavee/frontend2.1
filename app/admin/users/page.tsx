// client/app/admin/users/page.tsx
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

// ควรย้าย Type ไปไว้ที่ไฟล์กลาง @/types/index.ts
interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  address?: string | null;
  isVerified: boolean;
  lineId?: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchUsers = () => {
    api
      .get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to fetch users:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleVerify = async (userId: string) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-verify`);
      // อัปเดต state ทันทีเพื่อเปลี่ยนสีปุ่ม โดยไม่ต้อง fetch ใหม่
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userId ? { ...user, isVerified: !user.isVerified } : user
        )
      );
    } catch (error) {
      console.error("Failed to toggle verification", error);
      alert("Failed to update status.");
    }
  };

  const handleExport = async () => {
    try {
      // 1. ใช้ api (axios instance) เพื่อส่ง request ซึ่งจะแนบ Token ไปด้วย
      const response = await api.get("/admin/users/export-csv", {
        responseType: "blob", // บอก Axios ว่าเราคาดหวังข้อมูลประเภท Blob (ไฟล์)
      });

      // 2. สร้าง URL ชั่วคราวจากข้อมูล Blob ที่ได้รับมา
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // 3. สร้าง element <a> ที่มองไม่เห็นขึ้นมา
      const link = document.createElement("a");
      link.href = url;

      // 4. ดึงชื่อไฟล์จาก Header 'Content-Disposition' (ถ้ามี) หรือตั้งชื่อเอง
      const contentDisposition = response.headers["content-disposition"];
      let fileName = `users-export-${Date.now()}.csv`;
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch.length === 2) {
          fileName = fileNameMatch[1];
        }
      }
      link.setAttribute("download", fileName);

      // 5. เพิ่ม <a> เข้าไปใน body, สั่งคลิก, แล้วลบทิ้ง
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // เคลียร์ memory
    } catch (error) {
      console.error("Failed to export users:", error);
      alert("Failed to export user data.");
    }
  };

  useEffect(() => {
    api
      .get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to fetch users:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (userId: string, username: string) => {
    if (window.confirm(`Are you sure you want to delete user: ${username}?`)) {
      try {
        await api.delete(`/admin/users/${userId}`);
        setUsers((currentUsers) =>
          currentUsers.filter((user) => user.id !== userId)
        );
        alert("User deleted successfully.");
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete user.");
      }
    }
  };

  const handleResetPassword = async (userId: string) => {
    const newPassword = window.prompt(
      "Enter new password for the user (min. 6 characters):"
    );
    if (newPassword === null) return; // User cancelled
    if (newPassword.length >= 6) {
      try {
        await api.post(`/admin/users/${userId}/reset-password`, {
          newPassword,
        });
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
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
      {/* --- ส่วนหัว: Title และปุ่ม Export --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={handleExport}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm font-semibold w-full sm:w-auto"
        >
          Export Users to CSV
        </button>
      </div>

      {/* --- ส่วนตารางข้อมูล: ครอบด้วย div เพื่อให้ scroll ได้ --- */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white ">
          {/* --- หัวตาราง (Table Head) --- */}
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                User Info
              </th>
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                Contact Details
              </th>
              <th className="py-2 px-4 text-center text-sm font-semibold text-gray-700">
                Verification Status
              </th>
              <th className="py-2 px-4 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          {/* --- เนื้อหาตาราง (Table Body) --- */}
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                {/* คอลัมน์ที่ 1: ข้อมูล User */}
                <td className="py-3 px-4 align-top">
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Role: {user.role}
                  </p>
                </td>

                {/* คอลัมน์ที่ 2: ข้อมูลติดต่อ */}
                <td className="py-3 px-4 align-top">
                  <p>
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{user.phone || "-"}</p>
                  <p
                    className="text-sm text-gray-500 whitespace-normal break-words"
                    title={user.address || ""}
                  >
                    {user.address || "-"}
                  </p>
                  <p>
                    {user.lineId ? (
                      <span className="text-sm text-gray-500">
                        Line ID: {user.lineId}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">
                        Line ID: ไม่มี
                      </span>
                    )}
                  </p>
                </td>

                

                {/* คอลัมน์ที่ 3: สถานะ Verified */}
                <td className="py-3 px-4 text-center align-middle">
                  <button
                    onClick={() => handleToggleVerify(user.id)}
                    className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                      user.isVerified
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    }`}
                  >
                    {user.isVerified ? "VERIFIED" : "NOT VERIFIED"}
                  </button>
                </td>

                {/* คอลัมน์ที่ 4: ปุ่ม Actions */}
                <td className="py-3 px-4 text-center align-middle">
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
                  <a
                    href={`https://line.me/R/ti/p/~${user.lineId || ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 inline-block"
                  >
                    Contact
                  </a>
                  <button
                    onClick={() => handleResetPassword(user.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Reset Pass
                  </button>
                  <button
                    onClick={() => handleDelete(user.id, user.username)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* --- แสดงข้อความเมื่อไม่มีข้อมูล --- */}
        {users.length === 0 && !isLoading && (
          <p className="text-center py-8 text-gray-500">No users found.</p>
        )}
      </div>
    </div>
  );
}
