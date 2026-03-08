import { UserLayout } from "@/components/UserLayout";
import { Building2, Plus, Trash2, X, Check } from "lucide-react";
import { useState } from "react";

const banks = [
  { id: 1, name: "Chase Bank", account: "****4521", routing: "****7890", holder: "Alex Johnson", primary: true },
  { id: 2, name: "Bank of America", account: "****1234", routing: "****5678", holder: "Alex Johnson", primary: false },
];

const formFields = [
  { name: "bankName", label: "Bank Name", placeholder: "e.g. Chase Bank" },
  { name: "accountHolder", label: "Account Holder", placeholder: "Full name on account" },
  { name: "accountNumber", label: "Account Number", placeholder: "Enter account number" },
  { name: "routingNumber", label: "Routing Number", placeholder: "Enter routing number" },
];

export default function BankDetails() {
  const [showForm, setShowForm] = useState(false);

  return (
    <UserLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Bank Details</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Withdrawal accounts</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="accent-gradient text-accent-foreground text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 active:scale-[0.98] transition-transform"
          >
            {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {showForm ? "Cancel" : "Add Bank"}
          </button>
        </div>

        {showForm && (
          <div className="bg-card rounded-2xl border border-accent/30 p-4 animate-fade-in">
            <h3 className="font-bold text-sm mb-4">Add Bank Account</h3>
            <div className="space-y-3">
              {formFields.map((field) => (
                <div key={field.name}>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{field.label}</label>
                  <input
                    placeholder={field.placeholder}
                    className="w-full mt-1.5 px-3 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  />
                </div>
              ))}
              <button className="w-full accent-gradient text-accent-foreground text-sm font-semibold py-3.5 rounded-xl active:scale-[0.98] transition-transform mt-1">
                Save Account
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {banks.map((bank) => (
            <div key={bank.id} className={`bg-card rounded-2xl border p-4 animate-fade-in ${bank.primary ? "border-accent/30" : "border-border"}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${bank.primary ? "accent-gradient" : "bg-primary/10"}`}>
                    <Building2 className={`h-5 w-5 ${bank.primary ? "text-accent-foreground" : "text-primary"}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[14px]">{bank.name}</p>
                      {bank.primary && (
                        <span className="text-[10px] font-bold bg-accent/15 text-accent px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <Check className="h-2.5 w-2.5" /> Primary
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{bank.holder}</p>
                  </div>
                </div>
                <button className="h-8 w-8 rounded-lg bg-destructive/5 flex items-center justify-center text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/50 text-[11px] text-muted-foreground">
                <span>Acct: {bank.account}</span>
                <span>Routing: {bank.routing}</span>
              </div>
              {!bank.primary && (
                <button className="text-[11px] text-accent font-semibold mt-2">Set as primary</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </UserLayout>
  );
}
