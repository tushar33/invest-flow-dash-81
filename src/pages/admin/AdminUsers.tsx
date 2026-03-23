import { AdminLayout } from "@/components/AdminLayout";
import { AutoPayModeBadge } from "@/components/AutoPayModeBadge";
import { FilterBar, type FilterField } from "@/components/FilterBar";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { Search, Package, Eye, Plus, BookOpen } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { admin as adminApi } from "@/lib/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const AUTO_PAY_MODES = ["NONE", "HALF", "FULL"] as const;
type AutoPayModeValue = (typeof AUTO_PAY_MODES)[number];

function formatINR(n: number) { return "₹" + n.toLocaleString("en-IN"); }

const filterDefaults = { search: "", role: "", autoPayMode: "" };

const filterFields: FilterField[] = [
  { key: "search", label: "Search", type: "search", placeholder: "Name or email..." },
  {
    key: "role", label: "Role", type: "select", placeholder: "All Roles",
    options: [{ label: "User", value: "USER" }, { label: "Admin", value: "ADMIN" }],
  },
  {
    key: "autoPayMode", label: "Auto Pay Mode", type: "select", placeholder: "All Modes",
    options: [{ label: "None", value: "NONE" }, { label: "Half", value: "HALF" }, { label: "Full", value: "FULL" }],
  },
];

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { filters, setFilters, resetFilters, hasActiveFilters } = useUrlFilters(filterDefaults);

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users", filters],
    queryFn: () => adminApi.users({
      search: filters.search || undefined,
      role: filters.role || undefined,
      autoPayMode: filters.autoPayMode || undefined,
    }),
  });

  const [autopayUpdatingUserId, setAutopayUpdatingUserId] = useState<string | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [pkgAmount, setPkgAmount] = useState("");
  const [roiPct, setRoiPct] = useState("");

  const assignMutation = useMutation({
    mutationFn: () =>
      adminApi.assignPackage({
        userId: selectedUserId,
        principalAmount: Number(pkgAmount),
        roiPercentage: Number(roiPct),
      }),
    onSuccess: () => {
      toast({ title: "Package assigned successfully" });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-packages"] });
      setAssignOpen(false);
      setPkgAmount("");
      setRoiPct("");
    },
    onError: (err: Error) => {
      toast({ title: "Failed to assign package", description: err.message, variant: "destructive" });
    },
  });

  const autopayMutation = useMutation({
    mutationFn: ({ userId, autoPayMode }: { userId: string; autoPayMode: AutoPayModeValue }) =>
      adminApi.configureAutopay(userId, { autoPayMode }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setAutopayUpdatingUserId(null);
      toast({ title: "Auto Pay mode updated" });
    },
    onError: (err: Error) => {
      setAutopayUpdatingUserId(null);
      toast({ title: "Failed to update Auto Pay", description: err.message, variant: "destructive" });
    },
  });

  const handleAutopayChange = (userId: string, autoPayMode: AutoPayModeValue) => {
    setAutopayUpdatingUserId(userId);
    autopayMutation.mutate({ userId, autoPayMode });
  };

  const openAssignModal = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setPkgAmount("");
    setRoiPct("");
    setAssignOpen(true);
  };

  // Client-side fallback filter for role/autoPayMode if backend doesn't support it
  const filtered = (users ?? []).filter(u => {
    if (filters.search && !u.name.toLowerCase().includes(filters.search.toLowerCase()) && !(u.email ?? "").toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.role && u.role !== filters.role) return false;
    if (filters.autoPayMode && (u.autoPayMode ?? "NONE") !== filters.autoPayMode) return false;
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage platform users</p>
        </div>

        <FilterBar
          fields={filterFields}
          values={filters}
          onChange={(k, v) => setFilters({ [k]: v })}
          onReset={resetFilters}
          hasActive={hasActiveFilters}
        />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
              {filtered.map((u) => (
                <div key={u.id} className="bg-card rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email || "—"}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-accent/15 text-accent px-2 py-0.5 rounded-full">{u.role}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">Balance</span>
                    <span className="text-sm font-semibold">{formatINR(u.currentBalance)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">Packages</span>
                    <span className="text-sm font-semibold">{u.totalPackages}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1.5">Auto Pay Mode</p>
                    {currentUser?.id === u.id ? (
                      <AutoPayModeBadge mode={u.autoPayMode ?? "NONE"} />
                    ) : (
                      <Select
                        value={u.autoPayMode ?? "NONE"}
                        onValueChange={(v) => handleAutopayChange(u.id, v as AutoPayModeValue)}
                        disabled={autopayUpdatingUserId === u.id}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AUTO_PAY_MODES.map((m) => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border">
                    <Button size="sm" variant="outline" className="w-full justify-start text-xs" onClick={() => openAssignModal(u.id, u.name)}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> Assign Package
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start text-xs" onClick={() => navigate(`/admin/packages?userId=${u.id}`)}>
                      <Eye className="h-3.5 w-3.5 mr-1" /> View Packages
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start text-xs" onClick={() => navigate(`/wallet/ledger?userId=${u.id}`)}>
                      <BookOpen className="h-3.5 w-3.5 mr-1" /> View Ledger
                    </Button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="text-center text-muted-foreground py-12">No users found</p>
              )}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">Name</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">Email</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">Auto Pay</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">Packages</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">Balance</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">Role</th>
                    <th className="text-right text-xs font-medium text-muted-foreground p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4 text-sm font-medium">{u.name}</td>
                      <td className="p-4 text-sm text-muted-foreground">{u.email || "—"}</td>
                      <td className="p-4">
                        {currentUser?.id === u.id ? (
                          <AutoPayModeBadge mode={u.autoPayMode ?? "NONE"} />
                        ) : (
                          <Select
                            value={u.autoPayMode ?? "NONE"}
                            onValueChange={(v) => handleAutopayChange(u.id, v as AutoPayModeValue)}
                            disabled={autopayUpdatingUserId === u.id}
                          >
                            <SelectTrigger className="h-8 w-[100px] text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {AUTO_PAY_MODES.map((m) => (
                                <SelectItem key={m} value={m}>{m}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </td>
                      <td className="p-4 text-sm font-semibold">{u.totalPackages}</td>
                      <td className="p-4 text-sm font-semibold">{formatINR(u.currentBalance)}</td>
                      <td className="p-4"><span className="text-[10px] font-bold bg-accent/15 text-accent px-2 py-0.5 rounded-full">{u.role}</span></td>
                      <td className="p-4 text-right">
                        <div className="flex flex-col gap-2 w-[160px] ml-auto">
                          <Button size="sm" variant="outline" className="text-xs justify-center w-full" onClick={() => openAssignModal(u.id, u.name)}>
                            <Plus className="h-3.5 w-3.5 mr-1" /> Assign Package
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs justify-center w-full" onClick={() => navigate(`/admin/packages?userId=${u.id}`)}>
                            <Eye className="h-3.5 w-3.5 mr-1" /> View Packages
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs justify-center w-full" onClick={() => navigate(`/wallet/ledger?userId=${u.id}`)}>
                            <BookOpen className="h-3.5 w-3.5 mr-1" /> View Ledger
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="text-center text-muted-foreground py-12">No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Assign Package Modal */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Package</DialogTitle>
            <DialogDescription>Assign a new investment package to <span className="font-semibold text-foreground">{selectedUserName}</span>.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Package Amount (₹)</Label>
              <Input type="number" placeholder="e.g. 100000" value={pkgAmount} onChange={(e) => setPkgAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>ROI Percentage</Label>
              <Select value={roiPct} onValueChange={setRoiPct}>
                <SelectTrigger><SelectValue placeholder="Select ROI %" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="7">7%</SelectItem>
                  <SelectItem value="10">10%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOpen(false)}>Cancel</Button>
            <Button
              onClick={() => assignMutation.mutate()}
              disabled={!pkgAmount || !roiPct || assignMutation.isPending}
            >
              {assignMutation.isPending ? "Assigning..." : "Assign Package"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
