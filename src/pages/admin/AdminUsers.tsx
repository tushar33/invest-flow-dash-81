import { AdminLayout } from "@/components/AdminLayout";
import { Search, Package, Eye, Plus, BookOpen } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { admin as adminApi } from "@/lib/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

function formatINR(n: number) { return "₹" + n.toLocaleString("en-IN"); }

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: users, isLoading } = useQuery({ queryKey: ["admin-users"], queryFn: adminApi.users });
  const [search, setSearch] = useState("");

  // Assign package modal state
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

  const openAssignModal = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setPkgAmount("");
    setRoiPct("");
    setAssignOpen(true);
  };

  const filtered = (users ?? []).filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    (u.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage platform users</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

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
                  {u.autoPayMode && (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">Auto Pay</span>
                      <span className="text-xs font-medium bg-muted px-2 py-0.5 rounded">{u.autoPayMode}</span>
                    </div>
                  )}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border flex-wrap">
                    <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => openAssignModal(u.id, u.name)}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> Assign
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => navigate(`/admin/packages?userId=${u.id}`)}>
                      <Eye className="h-3.5 w-3.5 mr-1" /> Packages
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => navigate(`/wallet/ledger?userId=${u.id}`)}>
                      <BookOpen className="h-3.5 w-3.5 mr-1" /> Ledger
                    </Button>
                  </div>
                </div>
              ))}
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
                      <td className="p-4"><span className="text-xs font-medium bg-muted px-2 py-0.5 rounded">{u.autoPayMode || "—"}</span></td>
                      <td className="p-4 text-sm font-semibold">{u.totalPackages}</td>
                      <td className="p-4 text-sm font-semibold">{formatINR(u.currentBalance)}</td>
                      <td className="p-4"><span className="text-[10px] font-bold bg-accent/15 text-accent px-2 py-0.5 rounded-full">{u.role}</span></td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" className="text-xs" onClick={() => openAssignModal(u.id, u.name)}>
                            <Plus className="h-3.5 w-3.5 mr-1" /> Assign Package
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs" onClick={() => navigate(`/admin/packages?userId=${u.id}`)}>
                            <Eye className="h-3.5 w-3.5 mr-1" /> View Packages
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
