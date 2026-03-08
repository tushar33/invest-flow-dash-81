import { UserLayout } from "@/components/UserLayout";
import { Building2, Plus, Trash2, X, Check, AlertCircle } from "lucide-react";
import { useState } from "react";

interface BankAccount {
  id: number;
  holderName: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  primary: boolean;
}

const banks: BankAccount[] = [
  { id: 1, holderName: "Rahul Sharma", bankName: "State Bank of India", accountNumber: "****4521", ifsc: "SBIN0001234", primary: true },
];

const formFields = [
  { name: "holderName", label: "Account Holder Name", placeholder: "Full name as per bank records", type: "text" },
  { name: "bankName", label: "Bank Name", placeholder: "e.g. State Bank of India", type: "text" },
  { name: "accountNumber", label: "Account Number", placeholder: "Enter account number", type: "text" },
  { name: "confirmAccount", label: "Confirm Account Number", placeholder: "Re-enter account number", type: "text" },
  { name: "ifsc", label: "IFSC Code", placeholder: "e.g. SBIN0001234", type: "text" },
];

export default function BankDetails() {
  const [showForm, setShowForm] = useState(false);
  const hasBankDetails = banks.length > 0;

  return (
    <UserLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Bank Details</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Required for payouts</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="accent-gradient text-accent-foreground text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 active:scale-[0.98] transition-transform"
          >
            {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {showForm ? "Cancel" : "Add Bank"}
          </button>
        </div>

        {/* Notice if no bank details */}
        {!hasBankDetails && !showForm && (
          <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 flex items-start gap-3 animate-fade-in">
            <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-semibold text-warning">Bank Details Required</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">You must add your bank details before requesting a payout. Tap "Add Bank" to get started.</p>
            </div>
          </div>
        )}

        {showForm && (
          <div className="bg-card rounded-2xl border border-accent/30 p-4 animate-fade-in">
            <h3 className="font-bold text-sm mb-1">Add Bank Account</h3>
            <p className="text-[11px] text-muted-foreground mb-4">Please enter details exactly as per your bank records</p>
            <div className="space-y-3">
              {formFields.map((field) => (
                <div key={field.name}>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full mt-1.5 px-3 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  />
                </div>
              ))}
              <button className="w-full accent-gradient text-accent-foreground text-sm font-semibold py-3.5 rounded-xl active:scale-[0.98] transition-transform mt-1">
                Save Bank Details
              </button>
            </div>
          </div>
        )}

        {/* Saved Banks */}
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
                      <p className="font-bold text-[14px]">{bank.bankName}</p>
                    </div>
                    {bank.primary && (
                      <span className="text-[10px] font-bold bg-accent/15 text-accent px-2 py-0.5 rounded-full inline-flex items-center gap-0.5 mt-1">
                        <Check className="h-2.5 w-2.5" /> Primary
                      </span>
                    )}
                  </div>
                </div>
                <button className="h-8 w-8 rounded-lg bg-destructive/5 flex items-center justify-center text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-3 pt-3 border-t border-border/50 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Account Holder</span>
                  <span className="font-medium">{bank.holderName}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Account No.</span>
                  <span className="font-medium">{bank.accountNumber}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">IFSC</span>
                  <span className="font-medium">{bank.ifsc}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </UserLayout>
  );
}
