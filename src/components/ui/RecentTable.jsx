"use client";

import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RecentTableCard({ title, columns = [], rows = [] }) {
  const router = useRouter();
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "20px",
        padding: "20px",
        backgroundColor: "var(--color-surface)",
        boxShadow: "0 3px 16px rgba(0,0,0,0.15)",
        border: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[18px] font-semibold text-(--color-foreground)">
          Recent {title}
        </h2>

        <Button
          size="small"
          onClick={() => {
            router.push(`/${title.toLowerCase()}`);
          }}
          endIcon={<ArrowRight size={16} />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "13px",
            color: "var(--color-primary)",
          }}
        >
          View All
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-1">
          <thead>
            <tr className="bg-[#f5f7fb]">
              {columns.map((col, i) => (
                <th
                  key={col.id}
                  className={`text-left px-4 py-2 text-sm text-gray-600 ${
                    i === 0 ? "rounded-l-xl" : ""
                  } ${i === columns.length - 1 ? "rounded-r-xl" : ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="bg-white">
                {columns.map((col) => (
                  <td key={col.id} className="px-4 py-2 text-sm text-gray-700">
                    {col.render ? col.render(row[col.id], row) : row[col.id]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Paper>
  );
}
