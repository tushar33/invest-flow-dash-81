import { AdminLayout } from "@/components/AdminLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Search } from "lucide-react";

const users = [
  { id: 1, name: "Alex Johnson", email: "alex@example.com", invested: "$10,000", status: "active" as const },
  { id: 2, name: "Sarah Williams", email: "sarah@mail.com", invested: "$5,000", status: "active" as const },
  { id: 3, name: "Mike Chen", email: "mike@mail.com", invested: "$2,000", status: "active" as const },
  { id: 4, name: "Lisa Park", email: "lisa@mail.com", invested: "$0", status: "inactive" as const },
  { id: 5, name: "Tom Baker", email: "tom@mail.com", invested: "$7,500", status: "active" as const },
];

export default function AdminUsers() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage platform users</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Mobile cards */}
        <div className="space-y-3 md:hidden">
          {users.map((u) => (
            <div key={u.id} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
                <StatusBadge status={u.status}>{u.status}</StatusBadge>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">Invested</span>
                <span className="text-sm font-semibold">{u.invested}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Name</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Email</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Invested</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-muted/50 transition-colors">
                  <td className="p-4 text-sm font-medium">{u.name}</td>
                  <td className="p-4 text-sm text-muted-foreground">{u.email}</td>
                  <td className="p-4 text-sm font-semibold">{u.invested}</td>
                  <td className="p-4"><StatusBadge status={u.status}>{u.status}</StatusBadge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
