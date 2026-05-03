import { UserLayout } from "@/components/UserLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Building2, Plus, X, Check, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bankDetails as bankApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function BankDetails() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<{ accountHolderName: string; bankName: string; accountNumber: string; confirmAccount: string; ifscCode: string; accountType: "SAVINGS" | "CURRENT" }>({ accountHolderName: "", bankName: "", accountNumber: "", confirmAccount: "", ifscCode: "", accountType: "SAVINGS" });
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
        accountType: form.accountType,
      });
    },
    onSuccess: () => {
      toast({ title: "Account details saved" });
      setShowForm(false);
      setForm({ accountHolderName: "", bankName: "", accountNumber: "", confirmAccount: "", ifscCode: "", accountType: "SAVINGS" });
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
      <div className="space-y-6">
        <PageHeader
          icon={<Building2 className="h-5 w-5" />}
          title="Account Details"
          subtitle="Required for redemptions"
          actions={
            <button
              onClick={() => { setShowForm(!showForm); if (!showForm && bank) { setForm({ accountHolderName: bank.accountHolderName, bankName: bank.bankName, accountNumber: bank.accountNumber, confirmAccount: bank.accountNumber, ifscCode: bank.ifscCode, accountType: bank.accountType ?? "SAVINGS" }); } }}
              className="bg-gradient-accent text-accent-foreground text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 active:scale-[0.98] transition-transform shadow-glow"
            >
              {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              {showForm ? "Cancel" : bank ? "Edit" : "Add Account"}
            </button>
          }
        />

        {!bank && !showForm && (
          <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 flex items-start gap-3 animate-slide-up-fade">
            <div className="h-9 w-9 shrink-0 rounded-xl bg-warning/15 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-warning" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-warning">Account Details Required</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">You must add your account details before requesting a redemption.</p>
            </div>
          </div>
        )}

        {showForm && (
          <div className="bg-card rounded-2xl border border-accent/30 p-4 shadow-elevated animate-slide-up-fade">
            <h3 className="font-bold text-sm mb-1">{bank ? "Update" : "Add"} Account</h3>
            <p className="text-[11px] text-muted-foreground mb-4">Please enter details exactly as per your records</p>
            <div className="space-y-3">
              {formFields.map((field) => (
                <div key={field.name}>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.name as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    className="w-full mt-1.5 px-3 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  />
                </div>
              ))}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Account Type</label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  {(["SAVINGS", "CURRENT"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, accountType: type })}
                      className={`px-3 py-3 rounded-xl border text-sm font-semibold transition-all ${form.accountType === type ? "border-accent bg-accent/10 text-accent" : "border-input bg-background text-muted-foreground hover:border-accent/50"}`}
                    >
                      {type === "SAVINGS" ? "Savings" : "Current"}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}
                className="w-full bg-gradient-accent text-accent-foreground text-sm font-semibold py-3.5 rounded-xl disabled:opacity-50 active:scale-[0.98] transition-transform shadow-glow mt-1">
                {saveMutation.isPending ? "Saving..." : "Save Account Details"}
              </button>
            </div>
          </div>
        )}

        {bank && !showForm && (
          <div className="bg-card rounded-2xl border border-accent/30 p-4 shadow-card hover:shadow-elevated transition-shadow animate-slide-up-fade">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-accent flex items-center justify-center shrink-0 shadow-glow">
                  <Building2 className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-bold text-[14px]">{bank.bankName}</p>
                  <span className="text-[10px] font-bold bg-success/15 text-success px-2 py-0.5 rounded-full inline-flex items-center gap-0.5 mt-1">
                    <Check className="h-2.5 w-2.5" /> Verified
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border/50 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Account Holder</span>
                <span className="font-semibold">{bank.accountHolderName}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Account No.</span>
                <span className="font-semibold tabular-nums">****{bank.accountNumber.slice(-4)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">IFSC</span>
                <span className="font-semibold tabular-nums">{bank.ifscCode}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
