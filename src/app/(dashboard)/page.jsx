"use client";

import { BookOpen, Users, Layers, CircleUser } from "lucide-react";
import DashboardCard from "../../components/ui/DashboardCard";
import { useEffect, useState } from "react";
import { fetchDashboardCounts } from "../../lib/DashboardApi";

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: "",
    books: "",
    authors: "",
    categories: "",
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchDashboardCounts();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="bg-slate-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          url="Books"
          title="Books"
          value={stats.books || "..."}
          icon={<BookOpen />}
          hint="Total books"
          variant="primary"
        />
        <DashboardCard
          url="Authors"
          title="Authors"
          value={stats.authors || "..."}
          icon={<Users />}
          hint="Registered authors"
          variant="blue"
        />
        <DashboardCard
          url="/"
          title="Users"
          value={stats.users || "..."}
          icon={<CircleUser />}
          hint="Registered users"
          variant="red"
        />
        <DashboardCard
          url="Categories"
          title="Categories"
          value={stats.categories || "..."}
          icon={<Layers />}
          hint="Book categories"
          variant="green"
        />
      </div>
    </div>
  );
}
