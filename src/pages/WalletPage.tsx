import { UserLayout } from "@/components/UserLayout";
import { ArrowUpRight, ArrowDownLeft, Wallet as WalletIcon, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const transactions = [
  { id: 1, type: "ROI Credit", desc: "Growth Package – Cycle 4", amount: "+₹5,000", date: "Mar 7, 2026" },
  { id: 2, type: "Payout Debit", desc: "Bank withdrawal – Approved", amount: "-₹15,000", date: "Mar 5, 2026" },
  { id: 3, type: "ROI Credit", desc: "Starter Package – Cycle 2", amount: "+₹3,750", date: "Mar 4, 2026" },
  { id: 4, type: "ROI Credit", desc: "Growth Package – Cycle 3", amount: "+₹5,000", date: "Mar 1, 2026" },
  { id: 5, type: "Payout Debit", desc: "Bank withdrawal – Approved", amount: "-₹10,000", date: "Feb 25, 2026" },
  { id: 6, type: "ROI Credit", desc: "Starter Package – Cycle 1", amount: "+₹3,750", date: "Feb 20, 2026" },
  { id: 7, type: "ROI Credit", desc: "Growth Package – Cycle 2", amount: "+₹5,000", date: "Feb 15, 2026" },
];

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <UserLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold">Wallet</h1>
          <p className="text-sm text-muted-foreground mt-0.5">ROI credits & payout debits</p>
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
              {showBalance ? "₹24,500" : "••••••"}
            </p>
          </div>
        </div>

        {/* Summary Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl border border-border p-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Total Credited</p>
            <p className="text-base font-bold text-success mt-0.5">+₹48,500</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Total Debited</p>
            <p className="text-base font-bold text-foreground mt-0.5">-₹25,000</p>
          </div>
        </div>

        {/* Ledger */}
        <div>
          <h2 className="text-sm font-bold mb-3">Ledger</h2>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {transactions.map((tx, i) => {
              const isCredit = tx.type === "ROI Credit";
              return (
                <div key={tx.id} className={`flex items-center justify-between p-3.5 ${i < transactions.length - 1 ? "border-b border-border/50" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${isCredit ? "bg-success/10" : "bg-muted"}`}>
                      {isCredit ? (
                        <ArrowDownLeft className="h-4 w-4 text-success" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold">{tx.type}</p>
                      <p className="text-[11px] text-muted-foreground">{tx.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-[13px] font-bold ${isCredit ? "text-success" : "text-foreground"}`}>
                      {tx.amount}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
