"use client";

import { BookOpen, Users, Layers, CircleUser } from "lucide-react";
import DashboardCard from "../../components/ui/DashboardCard";

export default function Dashboard() {
  return (
    <div className="bg-slate-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary">Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Books"
          value="120"
          icon={<BookOpen />}
          hint="Total books"
          variant="primary"
        />
        <DashboardCard
          title="Authors"
          value="35"
          icon={<Users />}
          hint="Registered authors"
          variant="blue"
        />
        <DashboardCard
          title="Users"
          value="18"
          icon={<CircleUser />}
          hint="Registered Users"
          variant="red"
        />
        <DashboardCard
          title="Categories"
          value="12"
          icon={<Layers />}
          hint="Book categories"
          variant="green"
        />
      </div>
    </div>
  );
}
