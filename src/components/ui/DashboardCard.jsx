import Link from "next/link";

export default function DashboardCard({
  url,
  title,
  value,
  icon,
  hint,
  variant = "primary",
}) {
  const styles = {
    primary: {
      text: "text-primary",
      badge: "bg-primary/20 text-primary",
      ring: "hover:ring-primary/20",
    },
    blue: {
      text: "text-blue-700",
      badge: "bg-blue-100 text-blue-700",
      ring: "hover:ring-blue-200",
    },
    green: {
      text: "text-green-700",
      badge: "bg-green-100 text-green-700",
      ring: "hover:ring-green-200",
    },
    red: {
      text: "text-red-600",
      badge: "bg-red-100 text-red-600",
      ring: "hover:ring-red-200",
    },
  };

  const s = styles[variant] || styles.primary;

  return (
    <Link href={`${url.toLowerCase()}`}>
      <div
        className={`bg-surface rounded-2xl border border-black/10 shadow-md p-5 
        transition hover:-translate-y-0.5 hover:shadow-md hover:ring-2 ${s.ring}`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className={`text-sm font-medium ${s.text}`}>{title}</p>
            <p className={`text-3xl font-extrabold mt-1 ${s.text}`}>{value}</p>
            <p className="text-xs text-black/45 mt-2">{hint}</p>
          </div>

          <div
            className={`h-11 w-11 rounded-2xl flex items-center justify-center ${s.badge}`}
          >
            {icon}
          </div>
        </div>
      </div>
    </Link>
  );
}
