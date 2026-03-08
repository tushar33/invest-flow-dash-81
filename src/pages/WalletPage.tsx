import { UserLayout } from "@/components/UserLayout";
import { ArrowUpRight, ArrowDownLeft, Wallet as WalletIcon } from "lucide-react";

const transactions = [
  { id: 1, type: "ROI Credit", amount: "+$45.00", date: "Mar 7, 2026", description: "Growth Plan ROI" },
  { id: 2, type: "Payout Sent", amount: "-$200.00", date: "Mar 5, 2026", description: "Bank withdrawal" },
  { id: 3, type: "ROI Credit", amount: "+$45.00", date: "Mar 4, 2026", description: "Growth Plan ROI" },
  { id: 4, type: "Investment", amount: "-$2,000.00", date: "Mar 1, 2026", description: "Growth Plan" },
  { id: 5, type: "ROI Credit", amount: "+$60.00", date: "Feb 28, 2026", description: "Premium Plan ROI" },
  { id: 6, type: "Deposit", amount: "+$5,000.00", date: "Feb 25, 2026", description: "Wallet top-up" },
];

export default function WalletPage() {
  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Wallet</h1>
          <p className="text-sm text-muted-foreground mt-1">Your transaction history</p>
        </div>

        <div className="fintech-gradient rounded-xl p-5 text-primary-foreground">
          <div className="flex items-center gap-2 mb-2">
            <WalletIcon className="h-4 w-4 text-accent" />
            <span className="text-xs uppercase tracking-wider opacity-80">Available Balance</span>
          </div>
          <p className="text-3xl font-bold">$1,250.00</p>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 accent-gradient text-accent-foreground text-sm font-medium py-2.5 rounded-lg">
            Deposit
          </button>
          <button className="flex-1 bg-card border border-border text-foreground text-sm font-medium py-2.5 rounded-lg hover:bg-muted transition-colors">
            Withdraw
          </button>
        </div>

        <div>
          <h2 className="text-base font-semibold mb-3">Transactions</h2>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${tx.amount.startsWith("+") ? "bg-success/10" : "bg-muted"}`}>
                    {tx.amount.startsWith("+") ? (
                      <ArrowDownLeft className="h-4 w-4 text-success" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tx.type}</p>
                    <p className="text-xs text-muted-foreground">{tx.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${tx.amount.startsWith("+") ? "text-success" : "text-foreground"}`}>
                    {tx.amount}
                  </p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
