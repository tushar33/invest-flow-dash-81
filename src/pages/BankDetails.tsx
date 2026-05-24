import { UserLayout } from "@/components/UserLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Building2, Plus, X, AlertCircle, Upload, FileText, ExternalLink } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  bankDetails as bankApi,
  bankVerificationStatusLabel,
  normalizeBankVerificationStatus,
  resolveUploadUrl,
} from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LANG, accountTypeDisplay } from "@/lib/language";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg", "application/pdf"];
const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

type BankForm = {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  confirmAccount: string;
  ifscCode: string;
  accountType: "saving" | "current";
  aadharNumber: string;
  panNumber: string;
};

const emptyForm: BankForm = {
  accountHolderName: "",
  bankName: "",
  accountNumber: "",
  confirmAccount: "",
  ifscCode: "",
  accountType: "saving",
  aadharNumber: "",
  panNumber: "",
};

function validateFile(file: File | null): string | null {
  if (!file) return LANG.bank.documentRequired;
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) return LANG.bank.invalidFileType;
  if (file.size > MAX_FILE_SIZE) return LANG.bank.fileTooLarge;
  return null;
}

function isPdfSource(nameOrUrl: string, mimeType?: string): boolean {
  if (mimeType === "application/pdf") return true;
  return nameOrUrl.toLowerCase().endsWith(".pdf");
}

function DocumentPreview({
  label,
  url,
  compact = false,
}: {
  label: string;
  url: string;
  compact?: boolean;
}) {
  const isPdf = isPdfSource(url);

  return (
    <div className={`rounded-xl border border-border/60 bg-muted/30 overflow-hidden ${compact ? "" : ""}`}>
      <div className="px-3 py-2 flex items-center justify-between gap-2 border-b border-border/40">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-semibold text-accent inline-flex items-center gap-1 hover:underline"
        >
          {LANG.common.view} <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      {isPdf ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-2 p-6 hover:bg-muted/50 transition-colors"
        >
          <FileText className="h-10 w-10 text-accent" />
          <span className="text-xs font-medium text-muted-foreground">{LANG.common.openPdf}</span>
        </a>
      ) : (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          <img src={url} alt={LANG.common.documentAlt(label)} className="w-full max-h-48 object-contain bg-background" />
        </a>
      )}
    </div>
  );
}

function DocumentUploadField({
  label,
  file,
  existingUrl,
  onChange,
  error,
}: {
  label: string;
  file: File | null;
  existingUrl?: string;
  onChange: (file: File | null) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const savedUrl = resolveUploadUrl(existingUrl);

  useEffect(() => {
    if (!file) {
      setLocalPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const previewUrl = localPreviewUrl ?? savedUrl;
  const previewIsPdf = file
    ? isPdfSource(file.name, file.type)
    : savedUrl
      ? isPdfSource(savedUrl)
      : false;

  return (
    <div>
      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        {label} <span className="text-destructive">*</span>
      </label>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp,image/*,application/pdf"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`w-full mt-1.5 px-3 py-3 rounded-xl border border-dashed text-left transition-all flex items-center gap-3 ${
          error ? "border-destructive/50 bg-destructive/5" : "border-input bg-background hover:border-accent/50"
        }`}
      >
        <div className={`h-9 w-9 shrink-0 rounded-lg flex items-center justify-center ${file || existingUrl ? "bg-accent/15" : "bg-muted"}`}>
          {previewIsPdf ? (
            <FileText className="h-4 w-4 text-accent" />
          ) : (
            <Upload className="h-4 w-4 text-accent" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          {file ? (
            <>
              <p className="text-sm font-semibold truncate">{file.name}</p>
              <p className="text-[10px] text-muted-foreground">{LANG.common.fileSizeKb(Math.round(file.size / 1024))}</p>
            </>
          ) : existingUrl ? (
            <>
              <p className="text-sm font-semibold text-success">{LANG.common.documentUploaded}</p>
              <p className="text-[10px] text-muted-foreground">{LANG.common.tapToReplace}</p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold">{LANG.common.uploadDocument}</p>
              <p className="text-[10px] text-muted-foreground">{LANG.common.uploadHint}</p>
            </>
          )}
        </div>
      </button>

      {previewUrl && (
        <div className="mt-2">
          <DocumentPreview label={label} url={previewUrl} compact />
        </div>
      )}

      {error && <p className="text-[10px] text-destructive mt-1">{error}</p>}
    </div>
  );
}

export default function BankDetails() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<BankForm>(emptyForm);
  const [aadharDocument, setAadharDocument] = useState<File | null>(null);
  const [panDocument, setPanDocument] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: bank, isLoading } = useQuery({
    queryKey: ["bank-details", user?.id],
    queryFn: bankApi.get,
    enabled: Boolean(user?.id),
    refetchOnMount: "always",
    refetchInterval: (query) =>
      normalizeBankVerificationStatus(query.state.data?.verificationStatus) === "pending"
        ? 15_000
        : false,
  });

  const resetForm = () => {
    setForm(emptyForm);
    setAadharDocument(null);
    setPanDocument(null);
    setFieldErrors({});
  };

  const populateForm = () => {
    if (!bank) return;
    setForm({
      accountHolderName: bank.accountHolderName,
      bankName: bank.bankName,
      accountNumber: bank.accountNumber,
      confirmAccount: bank.accountNumber,
      ifscCode: bank.ifscCode,
      accountType: bank.accountType === "current" ? "current" : "saving",
      aadharNumber: bank.aadharNumber ?? "",
      panNumber: bank.panNumber ?? "",
    });
    setAadharDocument(null);
    setPanDocument(null);
    setFieldErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!form.accountHolderName.trim()) errors.accountHolderName = LANG.common.required;
    if (!form.bankName.trim()) errors.bankName = LANG.common.required;
    if (!form.accountNumber.trim()) errors.accountNumber = LANG.common.required;
    if (!form.confirmAccount.trim()) errors.confirmAccount = LANG.common.required;
    if (form.accountNumber !== form.confirmAccount) errors.confirmAccount = LANG.bank.accountMismatch;
    if (!form.ifscCode.trim()) errors.ifscCode = LANG.common.required;
    if (!/^\d{12}$/.test(form.aadharNumber.replace(/\s/g, ""))) errors.aadharNumber = LANG.bank.invalidAadhar;
    if (!PAN_PATTERN.test(form.panNumber.toUpperCase())) errors.panNumber = LANG.bank.invalidPan;

    const aadharFileError = aadharDocument
      ? validateFile(aadharDocument)
      : bank?.aadharDocumentUrl
        ? null
        : LANG.bank.documentRequired;
    if (aadharFileError) errors.aadharDocument = aadharFileError;

    const panFileError = panDocument
      ? validateFile(panDocument)
      : bank?.panDocumentUrl
        ? null
        : LANG.bank.documentRequired;
    if (panFileError) errors.panDocument = panFileError;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveMutation = useMutation({
    mutationFn: () => {
      if (!validateForm()) throw new Error(LANG.common.fixErrorsBelow);
      return bankApi.save({
        accountHolderName: form.accountHolderName.trim(),
        bankName: form.bankName.trim(),
        accountNumber: form.accountNumber.trim(),
        ifscCode: form.ifscCode.trim().toUpperCase(),
        accountType: form.accountType,
        aadharNumber: form.aadharNumber.replace(/\s/g, ""),
        panNumber: form.panNumber.toUpperCase(),
        ...(aadharDocument ? { aadharDocument } : {}),
        ...(panDocument ? { panDocument } : {}),
      });
    },
    onSuccess: () => {
      toast({ title: LANG.bank.saved });
      setShowForm(false);
      resetForm();
      qc.invalidateQueries({ queryKey: ["bank-details", user?.id] });
    },
    onError: (err: Error) => {
      if (err.message !== LANG.common.fixErrorsBelow) {
        toast({ title: LANG.common.error, description: err.message, variant: "destructive" });
      }
    },
  });

  const formFields = [
    { name: "accountHolderName", label: LANG.bank.accountHolderName, placeholder: LANG.bank.accountHolderNamePlaceholder },
    { name: "bankName", label: LANG.bank.bankName, placeholder: LANG.bank.bankNamePlaceholder },
    { name: "accountNumber", label: LANG.bank.accountNumber, placeholder: LANG.bank.accountNumberPlaceholder },
    { name: "confirmAccount", label: LANG.bank.confirmAccountNumber, placeholder: LANG.bank.confirmAccountPlaceholder },
    { name: "ifscCode", label: LANG.bank.ifscCode, placeholder: LANG.bank.ifscPlaceholder },
  ] as const;

  const maskId = (value: string) => {
    if (value.length <= 4) return value;
    return `${"*".repeat(value.length - 4)}${value.slice(-4)}`;
  };

  const verificationStatus = normalizeBankVerificationStatus(bank?.verificationStatus);
  const verificationBadgeStatus =
    verificationStatus === "verified" ? "approved" : verificationStatus === "rejected" ? "rejected" : "pending";
  const verificationLabel = bankVerificationStatusLabel(verificationStatus);

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
          title={LANG.bank.title}
          subtitle={LANG.bank.subtitle}
          actions={
            <button
              onClick={() => {
                if (!showForm) {
                  if (bank) populateForm();
                  else resetForm();
                } else {
                  resetForm();
                }
                setShowForm(!showForm);
              }}
              className="bg-gradient-accent text-accent-foreground text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 active:scale-[0.98] transition-transform shadow-glow"
            >
              {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              {showForm ? LANG.common.cancel : bank ? LANG.common.edit : LANG.bank.addAccount}
            </button>
          }
        />

        {!bank && !showForm && (
          <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 flex items-start gap-3 animate-slide-up-fade">
            <div className="h-9 w-9 shrink-0 rounded-xl bg-warning/15 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-warning" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-warning">{LANG.bank.requiredBannerTitle}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{LANG.bank.requiredBannerDescription}</p>
            </div>
          </div>
        )}

        {showForm && (
          <div className="bg-card rounded-2xl border border-accent/30 p-4 shadow-elevated animate-slide-up-fade">
            <h3 className="font-bold text-sm mb-1">{bank ? LANG.bank.updateAccountTitle : LANG.bank.addAccountTitle}</h3>
            <p className="text-[11px] text-muted-foreground mb-4">{LANG.bank.formHint}</p>
            <div className="space-y-3">
              {formFields.map((field) => (
                <div key={field.name}>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {field.label} <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={(e) => {
                      const value = field.name === "ifscCode" ? e.target.value.toUpperCase() : e.target.value;
                      setForm({ ...form, [field.name]: value });
                    }}
                    className={`w-full mt-1.5 px-3 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all ${
                      fieldErrors[field.name] ? "border-destructive/50" : "border-input"
                    }`}
                  />
                  {fieldErrors[field.name] && (
                    <p className="text-[10px] text-destructive mt-1">{fieldErrors[field.name]}</p>
                  )}
                </div>
              ))}

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {LANG.bank.accountType} <span className="text-destructive">*</span>
                </label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  {(["saving", "current"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, accountType: type })}
                      className={`px-3 py-3 rounded-xl border text-sm font-semibold transition-all ${form.accountType === type ? "border-accent bg-accent/10 text-accent" : "border-input bg-background text-muted-foreground hover:border-accent/50"}`}
                    >
                      {accountTypeDisplay(type)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {LANG.bank.aadharNumber} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  maxLength={12}
                  placeholder={LANG.bank.aadharPlaceholder}
                  value={form.aadharNumber}
                  onChange={(e) => setForm({ ...form, aadharNumber: e.target.value.replace(/\D/g, "").slice(0, 12) })}
                  className={`w-full mt-1.5 px-3 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all tabular-nums ${
                    fieldErrors.aadharNumber ? "border-destructive/50" : "border-input"
                  }`}
                />
                {fieldErrors.aadharNumber && (
                  <p className="text-[10px] text-destructive mt-1">{fieldErrors.aadharNumber}</p>
                )}
              </div>

              <DocumentUploadField
                label={LANG.bank.aadharDocument}
                file={aadharDocument}
                existingUrl={bank?.aadharDocumentUrl}
                onChange={(file) => {
                  setAadharDocument(file);
                  if (file) {
                    const err = validateFile(file);
                    setFieldErrors((prev) => {
                      const next = { ...prev };
                      if (err) next.aadharDocument = err;
                      else delete next.aadharDocument;
                      return next;
                    });
                  }
                }}
                error={fieldErrors.aadharDocument}
              />

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {LANG.bank.panNumber} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  placeholder={LANG.bank.panPlaceholder}
                  value={form.panNumber}
                  onChange={(e) => setForm({ ...form, panNumber: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10) })}
                  className={`w-full mt-1.5 px-3 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all uppercase ${
                    fieldErrors.panNumber ? "border-destructive/50" : "border-input"
                  }`}
                />
                {fieldErrors.panNumber && (
                  <p className="text-[10px] text-destructive mt-1">{fieldErrors.panNumber}</p>
                )}
              </div>

              <DocumentUploadField
                label={LANG.bank.panDocument}
                file={panDocument}
                existingUrl={bank?.panDocumentUrl}
                onChange={(file) => {
                  setPanDocument(file);
                  if (file) {
                    const err = validateFile(file);
                    setFieldErrors((prev) => {
                      const next = { ...prev };
                      if (err) next.panDocument = err;
                      else delete next.panDocument;
                      return next;
                    });
                  }
                }}
                error={fieldErrors.panDocument}
              />

              <button
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending}
                className="w-full bg-gradient-accent text-accent-foreground text-sm font-semibold py-3.5 rounded-xl disabled:opacity-50 active:scale-[0.98] transition-transform shadow-glow mt-1"
              >
                {saveMutation.isPending ? LANG.common.saving : LANG.bank.saveAccountDetails}
              </button>
            </div>
          </div>
        )}

        {bank && !showForm && verificationStatus === "pending" && (
          <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 flex items-start gap-3 animate-slide-up-fade">
            <div className="h-9 w-9 shrink-0 rounded-xl bg-warning/15 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-warning" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-warning">{LANG.status.verificationPending}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {LANG.bank.underReviewRedemption}
              </p>
            </div>
          </div>
        )}

        {bank && !showForm && verificationStatus === "rejected" && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-start gap-3 animate-slide-up-fade">
            <div className="h-9 w-9 shrink-0 rounded-xl bg-destructive/15 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-destructive">{LANG.status.verificationRejected}</p>
              {bank.rejectionReason ? (
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  <span className="font-semibold text-foreground">{LANG.common.reason}: </span>
                  {bank.rejectionReason}
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {LANG.bank.rejectedResubmit}
                </p>
              )}
              <p className="text-[11px] text-muted-foreground mt-1">{LANG.bank.updateAndResubmit}</p>
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
                  <StatusBadge status={verificationBadgeStatus} className="mt-1">
                    {verificationLabel}
                  </StatusBadge>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border/50 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">{LANG.bank.accountHolder}</span>
                <span className="font-semibold">{bank.accountHolderName}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">{LANG.bank.accountNo}</span>
                <span className="font-semibold tabular-nums">****{bank.accountNumber.slice(-4)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">{LANG.bank.ifsc}</span>
                <span className="font-semibold tabular-nums">{bank.ifscCode}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">{LANG.bank.accountType}</span>
                <span className="font-semibold">{accountTypeDisplay(bank.accountType)}</span>
              </div>
              {bank.aadharNumber && (
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">{LANG.bank.aadhar}</span>
                  <span className="font-semibold tabular-nums">{maskId(bank.aadharNumber)}</span>
                </div>
              )}
              {bank.panNumber && (
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">{LANG.bank.pan}</span>
                  <span className="font-semibold tabular-nums">{maskId(bank.panNumber)}</span>
                </div>
              )}
              {verificationStatus === "rejected" && bank.rejectionReason && (
                <div className="flex items-start justify-between gap-3 text-[11px] pt-1">
                  <span className="text-muted-foreground shrink-0">{LANG.bank.rejectionReason}</span>
                  <span className="font-semibold text-destructive text-right">{bank.rejectionReason}</span>
                </div>
              )}
            </div>

            {(bank.aadharDocumentUrl || bank.panDocumentUrl) && (
              <div className="mt-4 pt-3 border-t border-border/50 space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{LANG.common.documents}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {bank.aadharDocumentUrl && (
                    <DocumentPreview label={LANG.bank.aadhar} url={resolveUploadUrl(bank.aadharDocumentUrl)!} />
                  )}
                  {bank.panDocumentUrl && (
                    <DocumentPreview label={LANG.bank.pan} url={resolveUploadUrl(bank.panDocumentUrl)!} />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
