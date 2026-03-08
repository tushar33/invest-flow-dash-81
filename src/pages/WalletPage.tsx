import { UserLayout } from "@/components/UserLayout";
import { ArrowUpRight, ArrowDownLeft, Wallet as WalletIcon, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const transactions = [
  { id: 1, type: "ROI Credit", amount: "+$45.00", date: "Mar 7", description: "Growth Plan ROI" },
  { id: 2, type: "Payout Sent", amount: "-$200.00", date: "Mar 5", description: "Bank withdrawal" },
  { id: 3, type: "ROI Credit", amount: "+$45.00", date: "Mar 4", description: "Growth Plan ROI" },
  { id: 4, type: "Investment", amount: "-$2,000.00", date: "Mar 1", description: "Growth Plan" },
  { id: 5, type: "ROI Credit", amount: "+$60.00", date: "Feb 28", description: "Premium Plan ROI" },
  { id: 6, type: "Deposit", amount: "+$5,000.00", date: "Feb 25", description: "Wallet top-up" },
];

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <UserLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold">Wallet</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Your funds & transactions</p>
        </div>

        {/* Balance Card */}
        <div className="fintech-gradient rounded-2xl p-5 text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-accent/5 rounded-full -translate-y-6 translate-x-6" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <WalletIcon className="h-4 w-4 text-accent" />
              <span className="text-[11px] uppercase tracking-widest opacity-70 font-medium">Available Balance</span>
              <button onClick={() => setShowBalance(!showBalance)} className="ml-auto opacity-60 hover:opacity-100 transition-opacity">
                {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[32px] font-bold leading-tight">
              {showBalance ? "$1,250.00" : "••••••"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="accent-gradient text-accent-foreground text-sm font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
            <ArrowDownLeft className="h-4 w-4" />
            Deposit
          </button>
          <button className="bg-card border border-border text-foreground text-sm font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-muted active:scale-[0.98] transition-all">
            <ArrowUpRight className="h-4 w-4" />
            Withdraw
          </button>
        </div>

        {/* Transactions */}
        <div>
          <h2 className="text-sm font-bold mb-3">Transactions</h2>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {transactions.map((tx, i) => (
              <div key={tx.id} className={`flex items-center justify-between p-3.5 ${i < transactions.length - 1 ? "border-b border-border/50" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${tx.amount.startsWith("+") ? "bg-success/10" : "bg-muted"}`}>
                    {tx.amount.startsWith("+") ? (
                      <ArrowDownLeft className="h-4 w-4 text-success" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold">{tx.type}</p>
                    <p className="text-[11px] text-muted-foreground">{tx.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-[13px] font-bold ${tx.amount.startsWith("+") ? "text-success" : "text-foreground"}`}>
                    {tx.amount}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{tx.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
