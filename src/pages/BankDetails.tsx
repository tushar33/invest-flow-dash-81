import { UserLayout } from "@/components/UserLayout";
import { Building2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const banks = [
  { id: 1, name: "Chase Bank", account: "****4521", routing: "****7890", primary: true },
  { id: 2, name: "Bank of America", account: "****1234", routing: "****5678", primary: false },
];

export default function BankDetails() {
  const [showForm, setShowForm] = useState(false);

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Bank Details</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your withdrawal accounts</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="accent-gradient text-accent-foreground text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add Bank
          </button>
        </div>

        {showForm && (
          <div className="bg-card rounded-xl border border-border p-4 animate-fade-in space-y-3">
            <h3 className="font-semibold text-sm">Add Bank Account</h3>
            {["Bank Name", "Account Number", "Routing Number", "Account Holder Name"].map((label) => (
              <div key={label}>
                <label className="text-xs font-medium text-muted-foreground">{label}</label>
                <input
                  placeholder={label}
                  className="w-full mt-1 px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            ))}
            <button className="w-full accent-gradient text-accent-foreground text-sm font-medium py-2.5 rounded-lg">
              Save Account
            </button>
          </div>
        )}

        <div className="space-y-3">
          {banks.map((bank) => (
            <div key={bank.id} className="bg-card rounded-xl border border-border p-4 animate-fade-in">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{bank.name}</p>
                      {bank.primary && (
                        <span className="text-[10px] font-medium bg-accent/15 text-accent px-1.5 py-0.5 rounded-full">Primary</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">Account: {bank.account}</p>
                    <p className="text-xs text-muted-foreground">Routing: {bank.routing}</p>
                  </div>
                </div>
                <button className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </UserLayout>
  );
}
