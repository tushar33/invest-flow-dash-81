import { UserLayout } from "@/components/UserLayout";
import { Building2, Plus, X, Check, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bankDetails as bankApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function BankDetails() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ accountHolderName: "", bankName: "", accountNumber: "", confirmAccount: "", ifscCode: "" });
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: bank, isLoading } = useQuery({ queryKey: ["bank-details"], queryFn: bankApi.get });

  const saveMutation = useMutation({
    mutationFn: () => {
      if (form.accountNumber !== form.confirmAccount) throw new Error("Account numbers do not match");
      return bankApi.save({
        accountHolderName: form.accountHolderName,
        bankName: form.bankName,
        accountNumber: form.accountNumber,
        ifscCode: form.ifscCode,
      });
    },
    onSuccess: () => {
      toast({ title: "Bank details saved" });
      setShowForm(false);
      setForm({ accountHolderName: "", bankName: "", accountNumber: "", confirmAccount: "", ifscCode: "" });
      qc.invalidateQueries({ queryKey: ["bank-details"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const formFields = [
    { name: "accountHolderName", label: "Account Holder Name", placeholder: "Full name as per bank records" },
    { name: "bankName", label: "Bank Name", placeholder: "e.g. State Bank of India" },
    { name: "accountNumber", label: "Account Number", placeholder: "Enter account number" },
    { name: "confirmAccount", label: "Confirm Account Number", placeholder: "Re-enter account number" },
    { name: "ifscCode", label: "IFSC Code", placeholder: "e.g. SBIN0001234" },
  ];

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Bank Details</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Required for payouts</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); if (!showForm && bank) { setForm({ accountHolderName: bank.accountHolderName, bankName: bank.bankName, accountNumber: bank.accountNumber, confirmAccount: bank.accountNumber, ifscCode: bank.ifscCode }); } }}
            className="accent-gradient text-accent-foreground text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 active:scale-[0.98] transition-transform"
          >
            {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {showForm ? "Cancel" : bank ? "Edit" : "Add Bank"}
          </button>
        </div>

        {!bank && !showForm && (
          <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 flex items-start gap-3 animate-fade-in">
            <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-semibold text-warning">Bank Details Required</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">You must add your bank details before requesting a payout.</p>
            </div>
          </div>
        )}

        {showForm && (
          <div className="bg-card rounded-2xl border border-accent/30 p-4 animate-fade-in">
            <h3 className="font-bold text-sm mb-1">{bank ? "Update" : "Add"} Bank Account</h3>
            <p className="text-[11px] text-muted-foreground mb-4">Please enter details exactly as per your bank records</p>
            <div className="space-y-3">
              {formFields.map((field) => (
                <div key={field.name}>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.name as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    className="w-full mt-1.5 px-3 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  />
                </div>
              ))}
              <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}
                className="w-full accent-gradient text-accent-foreground text-sm font-semibold py-3.5 rounded-xl disabled:opacity-50 active:scale-[0.98] transition-transform mt-1">
                {saveMutation.isPending ? "Saving..." : "Save Bank Details"}
              </button>
            </div>
          </div>
        )}

        {bank && !showForm && (
          <div className="bg-card rounded-2xl border border-accent/30 p-4 animate-fade-in">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl accent-gradient flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-bold text-[14px]">{bank.bankName}</p>
                  <span className="text-[10px] font-bold bg-accent/15 text-accent px-2 py-0.5 rounded-full inline-flex items-center gap-0.5 mt-1">
                    <Check className="h-2.5 w-2.5" /> Saved
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Account Holder</span>
                <span className="font-medium">{bank.accountHolderName}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Account No.</span>
                <span className="font-medium">****{bank.accountNumber.slice(-4)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">IFSC</span>
                <span className="font-medium">{bank.ifscCode}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
