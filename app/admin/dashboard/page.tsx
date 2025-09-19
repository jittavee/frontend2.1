// client/app/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Stats {
  totalUsers: number;
  totalJobs: number;
  openJobs: number;
  totalApplications: number;
}

// Component ย่อยสำหรับการ์ดแต่ละใบ
function StatCard({ title, value, icon }: { title: string; value: number | string; icon: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center">
        <div className="text-3xl mr-4">{icon}</div>
        <div>
          <p className="text-gray-500">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error("Failed to fetch stats", err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <p>Loading dashboard...</p>;
  if (!stats) return <p>Could not load dashboard data.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon="👥" />
        <StatCard title="Total Job Posts" value={stats.totalJobs} icon="📄" />
        <StatCard title="Open Jobs" value={stats.openJobs} icon="🟢" />
        <StatCard title="Total Applications" value={stats.totalApplications} icon="📝" />
      </div>
    </div>
  );
}