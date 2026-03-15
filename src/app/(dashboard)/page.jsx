"use client";

import { BookOpen, Users, Layers, CircleUser } from "lucide-react";
import { useEffect, useState } from "react";

import DashboardCard from "../../components/ui/DashboardCard";
import RecentTableCard from "../../components/ui/RecentTable";
import ProtectedRoutes from "../../components/helpres/ProtectedRoutes";

import { fetchDashboardCounts } from "../../lib/DashboardApi";
import { fetchBooks } from "../../lib/BookApi";
import { fetchCategories } from "../../lib/CategoryApi";

const bookColumns = [
  { id: "id", label: "ID" },
  { id: "title", label: "Title" },
  { id: "isbn", label: "ISBN" },
  {
    id: "price",
    label: "Price",
    render: (value) => (value != null ? "$" + Number(value).toFixed(2) : "-"),
  },
  { id: "publisher", label: "Publisher" },
];

const categoryColumns = [
  { id: "id", label: "ID" },
  { id: "name", label: "Name" },
  {
    id: "status",
    label: "Status",
    render: (value) => <StatusBadge status={value} />,
  },
];

function StatusBadge({ status }) {
  const isActive = String(status).toLowerCase() === "active";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {status}
    </span>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: "",
    books: "",
    authors: "",
    categories: "",
  });

  const [recentBooks, setRecentBooks] = useState([]);
  const [recentCategories, setRecentCategories] = useState([]);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchDashboardCounts();
        setStats(data);
      } catch (err) {
        console.error("Failed to load dashboard counts:", err);
      }
    }

    async function loadRecentBooks() {
      try {
        const data = await fetchBooks({
          page: 1,
          pageSize: 5,
        });

        const mappedBooks = (data.items || []).map((book) => ({
          id: book.id,
          title: book.name || "-",
          isbn: book.isbn || book.isbn13 || "-",
          price: book.price || "-",
          publisher: book.publisherName || "-",
        }));

        setRecentBooks(mappedBooks);
      } catch (err) {
        console.error("Failed to load recent books:", err);
      }
    }

    async function loadRecentCategories() {
      try {
        const data = await fetchCategories({
          page: 1,
          pageSize: 5,
        });

        setRecentCategories(data.items || []);
      } catch (err) {
        console.error("Failed to load recent categories:", err);
      }
    }

    loadStats();
    loadRecentBooks();
    loadRecentCategories();
  }, []);

  return (
    <ProtectedRoutes>
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
            hint="Listed Books"
            variant="primary"
          />
          <DashboardCard
            url="Authors"
            title="Authors"
            value={stats.authors || "..."}
            icon={<Users />}
            hint="Listed Authors"
            variant="blue"
          />
          <DashboardCard
            url="/"
            title="Users"
            value={stats.users || "..."}
            icon={<CircleUser />}
            hint="Registered Users"
            variant="red"
          />
          <DashboardCard
            url="Categories"
            title="Categories"
            value={stats.categories || "..."}
            icon={<Layers />}
            hint="Categories Listed"
            variant="green"
          />
        </div>

        <div className="flex flex-col xl:flex-row gap-5 my-5">
          <div className="w-full xl:flex-2">
            <RecentTableCard
              title="Books"
              columns={bookColumns}
              rows={recentBooks}
              onViewAll={() => {}}
            />
          </div>

          <div className="w-full xl:flex-1">
            <RecentTableCard
              title="Categories"
              columns={categoryColumns}
              rows={recentCategories}
              onViewAll={() => {}}
            />
          </div>
        </div>
      </div>
    </ProtectedRoutes>
  );
}
