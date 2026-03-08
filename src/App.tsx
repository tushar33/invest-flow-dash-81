import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Packages from "./pages/Packages";
import WalletPage from "./pages/WalletPage";
import Payouts from "./pages/Payouts";
import BankDetails from "./pages/BankDetails";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPackages from "./pages/admin/AdminPackages";
import AdminPayouts from "./pages/admin/AdminPayouts";
import AdminROILogs from "./pages/admin/AdminROILogs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/payouts" element={<Payouts />} />
          <Route path="/bank-details" element={<BankDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/packages" element={<AdminPackages />} />
          <Route path="/admin/payouts" element={<AdminPayouts />} />
          <Route path="/admin/roi-logs" element={<AdminROILogs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
