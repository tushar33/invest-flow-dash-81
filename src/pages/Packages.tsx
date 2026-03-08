import { UserLayout } from "@/components/UserLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Package, TrendingUp, Clock } from "lucide-react";

const packages = [
  { id: 1, name: "Starter Plan", amount: "$500", roi: "5%", duration: "30 days", status: "active" as const },
  { id: 2, name: "Growth Plan", amount: "$2,000", roi: "8%", duration: "60 days", status: "active" as const },
  { id: 3, name: "Premium Plan", amount: "$5,000", roi: "12%", duration: "90 days", status: "active" as const },
  { id: 4, name: "Elite Plan", amount: "$10,000", roi: "15%", duration: "120 days", status: "inactive" as const },
];

export default function Packages() {
  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Investment Packages</h1>
          <p className="text-sm text-muted-foreground mt-1">Choose a plan that fits your goals</p>
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
                    <p className="text-xl font-bold mt-0.5">{pkg.amount}</p>
                  </div>
                </div>
                <StatusBadge status={pkg.status}>{pkg.status}</StatusBadge>
              </div>
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span>{pkg.roi} ROI</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{pkg.duration}</span>
                </div>
              </div>
              {pkg.status === "active" && (
                <button className="w-full mt-3 accent-gradient text-accent-foreground text-sm font-medium py-2.5 rounded-lg transition-opacity hover:opacity-90">
                  Invest Now
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </UserLayout>
  );
}
