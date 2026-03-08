import { UserLayout } from "@/components/UserLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Package, TrendingUp, Clock, Users, Star } from "lucide-react";

const packages = [
  { id: 1, name: "Starter", amount: "$500", roi: "5%", duration: "30 days", status: "active" as const, investors: 245, popular: false },
  { id: 2, name: "Growth", amount: "$2,000", roi: "8%", duration: "60 days", status: "active" as const, investors: 432, popular: true },
  { id: 3, name: "Premium", amount: "$5,000", roi: "12%", duration: "90 days", status: "active" as const, investors: 189, popular: false },
  { id: 4, name: "Elite", amount: "$10,000", roi: "15%", duration: "120 days", status: "inactive" as const, investors: 26, popular: false },
];

export default function Packages() {
  return (
    <UserLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold">Investment Plans</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Choose a plan that fits your goals</p>
        </div>

        {/* Summary bar */}
        <div className="fintech-gradient rounded-2xl p-4 text-primary-foreground flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-widest opacity-70">Your Active Plans</p>
            <p className="text-xl font-bold mt-0.5">2 packages</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-widest opacity-70">Monthly ROI</p>
            <p className="text-xl font-bold mt-0.5 text-accent">$450</p>
          </div>
        </div>

        <div className="space-y-3">
          {packages.map((pkg) => (
            <div key={pkg.id} className={`bg-card rounded-2xl border p-4 animate-fade-in relative overflow-hidden ${pkg.popular ? "border-accent shadow-sm" : "border-border"}`}>
              {pkg.popular && (
                <div className="absolute top-0 right-0 accent-gradient text-accent-foreground text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                  <Star className="h-3 w-3" /> POPULAR
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${pkg.popular ? "accent-gradient" : "bg-accent/10"}`}>
                  <Package className={`h-5 w-5 ${pkg.popular ? "text-accent-foreground" : "text-accent"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[15px]">{pkg.name}</p>
                    <StatusBadge status={pkg.status}>{pkg.status}</StatusBadge>
                  </div>
                  <p className="text-2xl font-bold mt-0.5">{pkg.amount}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted rounded-lg px-2.5 py-1.5">
                  <TrendingUp className="h-3 w-3 text-accent" />
                  <span className="font-semibold text-foreground">{pkg.roi}</span> ROI
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted rounded-lg px-2.5 py-1.5">
                  <Clock className="h-3 w-3" />
                  {pkg.duration}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted rounded-lg px-2.5 py-1.5">
                  <Users className="h-3 w-3" />
                  {pkg.investors}
                </div>
              </div>

              {pkg.status === "active" && (
                <button className={`w-full mt-3 text-sm font-semibold py-3 rounded-xl transition-all active:scale-[0.98] ${pkg.popular ? "accent-gradient text-accent-foreground" : "bg-primary text-primary-foreground"}`}>
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
