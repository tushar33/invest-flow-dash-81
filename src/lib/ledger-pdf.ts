import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import trinityLogo from "@/assets/trinity-arrows-logo.png";
import { formatTransactionLabel } from "@/lib/format";

interface LedgerTxn {
  id: string;
  type: string;
  direction: "CREDIT" | "DEBIT" | string;
  amount: string | number;
  createdAt: string;
  description?: string | null;
  status?: string | null;
  referenceId?: string | null;
}

interface GenerateArgs {
  memberName: string;
  userIdDisplay: string;
  transactions: LedgerTxn[];
  closingBalance: number | string;
  dateFrom?: string;
  dateTo?: string;
}

async function loadImageAsDataUrl(src: string): Promise<string | null> {
  try {
    const res = await fetch(src);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generateLedgerPdf({
  memberName,
  userIdDisplay,
  transactions,
  closingBalance,
  dateFrom,
  dateTo,
}: GenerateArgs) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 40;

  // Header
  const logoData = await loadImageAsDataUrl(trinityLogo);
  if (logoData) {
    try {
      doc.addImage(logoData, "PNG", marginX, 30, 44, 44);
    } catch {
      /* ignore */
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(10, 37, 64);
  doc.text("Trinity Arrows", marginX + 54, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(90, 90, 90);
  doc.text("Ledger Statement", marginX + 54, 66);

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  const genOn = `Generated: ${format(new Date(), "MMM d, yyyy 'at' h:mm a")}`;
  doc.text(genOn, pageWidth - marginX, 40, { align: "right" });
  if (dateFrom || dateTo) {
    const range = `Period: ${dateFrom || "Beginning"} to ${dateTo || "Today"}`;
    doc.text(range, pageWidth - marginX, 54, { align: "right" });
  }

  // Member info
  doc.setDrawColor(220, 220, 220);
  doc.line(marginX, 90, pageWidth - marginX, 90);
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.setFont("helvetica", "bold");
  doc.text("Member:", marginX, 108);
  doc.text("User ID:", marginX, 124);
  doc.setFont("helvetica", "normal");
  doc.text(memberName, marginX + 60, 108);
  doc.text(userIdDisplay, marginX + 60, 124);

  // Compute totals & running balance
  const sortedAsc = [...transactions].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  let totalCredits = 0;
  let totalDebits = 0;
  for (const t of sortedAsc) {
    const amt = Number(t.amount) || 0;
    if (t.direction === "CREDIT") totalCredits += amt;
    else totalDebits += amt;
  }
  const closing = Number(closingBalance) || 0;
  const opening = closing - totalCredits + totalDebits;

  // Running balances (ascending)
  let running = opening;
  const rowsAsc = sortedAsc.map((t) => {
    const amt = Number(t.amount) || 0;
    if (t.direction === "CREDIT") running += amt;
    else running -= amt;
    return {
      date: format(new Date(t.createdAt), "MMM d, yyyy"),
      description: t.description || formatTransactionLabel(t.type),
      type: formatTransactionLabel(t.type),
      credit: t.direction === "CREDIT" ? amt.toLocaleString("en-IN") : "",
      debit: t.direction === "DEBIT" ? amt.toLocaleString("en-IN") : "",
      balance: running.toLocaleString("en-IN"),
      status: t.status || "COMPLETED",
    };
  });
  // Show newest first in PDF (matches on-screen)
  const rows = rowsAsc.reverse();

  // Summary card
  const summaryY = 148;
  doc.setFillColor(245, 249, 252);
  doc.setDrawColor(220, 230, 236);
  doc.roundedRect(marginX, summaryY, pageWidth - marginX * 2, 60, 6, 6, "FD");
  const colW = (pageWidth - marginX * 2) / 4;
  const items = [
    ["Opening Balance", opening.toLocaleString("en-IN")],
    ["Total Credits", totalCredits.toLocaleString("en-IN")],
    ["Total Debits", totalDebits.toLocaleString("en-IN")],
    ["Closing Balance", closing.toLocaleString("en-IN")],
  ];
  items.forEach(([label, val], i) => {
    const cx = marginX + colW * i + 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(110, 120, 130);
    doc.text(label, cx, summaryY + 22);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(10, 37, 64);
    doc.text(val, cx, summaryY + 42);
  });

  // Table
  autoTable(doc, {
    startY: summaryY + 80,
    head: [["Date", "Description", "Type", "Credit", "Debit", "Balance", "Status"]],
    body: rows.map((r) => [r.date, r.description, r.type, r.credit, r.debit, r.balance, r.status]),
    styles: { fontSize: 8, cellPadding: 5 },
    headStyles: { fillColor: [10, 37, 64], textColor: 255 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      3: { halign: "right" },
      4: { halign: "right" },
      5: { halign: "right" },
    },
    margin: { left: marginX, right: marginX },
  });

  const fname = `ledger_${format(new Date(), "yyyyMMdd_HHmm")}.pdf`;
  doc.save(fname);
}
