import { AdminLayout } from "@/components/AdminLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Package, Plus, Pencil } from "lucide-react";

const packages = [
  { id: 1, name: "Starter Plan", amount: "$500", roi: "5%", duration: "30 days", status: "active" as const, investors: 245 },
  { id: 2, name: "Growth Plan", amount: "$2,000", roi: "8%", duration: "60 days", status: "active" as const, investors: 432 },
  { id: 3, name: "Premium Plan", amount: "$5,000", roi: "12%", duration: "90 days", status: "active" as const, investors: 189 },
  { id: 4, name: "Elite Plan", amount: "$10,000", roi: "15%", duration: "120 days", status: "inactive" as const, investors: 26 },
];

export default function AdminPackages() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Packages</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage investment packages</p>
          </div>
          <button className="accent-gradient text-accent-foreground text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            Add Package
          </button>
        </div>

        <div className="space-y-3">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-card rounded-xl border border-border p-4 animate-fade-in">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{pkg.name}</p>
                    <p className="text-lg font-bold">{pkg.amount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={pkg.status}>{pkg.status}</StatusBadge>
                  <button className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center hover:bg-border transition-colors">
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                <span>ROI: {pkg.roi}</span>
                <span>Duration: {pkg.duration}</span>
                <span>{pkg.investors} investors</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
