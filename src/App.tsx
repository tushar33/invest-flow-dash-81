import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Products from "./pages/public/Products";
import Services from "./pages/public/Services";
import Contact from "./pages/public/Contact";
import Dashboard from "./pages/Dashboard";
import Packages from "./pages/Packages";
import WalletPage from "./pages/WalletPage";
import WalletLedger from "./pages/WalletLedger";
import Payouts from "./pages/Payouts";
import BankDetails from "./pages/BankDetails";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminPackages = lazy(() => import("./pages/admin/AdminPackages"));
const AdminPayouts = lazy(() => import("./pages/admin/AdminPayouts"));
const AdminROILogs = lazy(() => import("./pages/admin/AdminROILogs"));
const AdminSimulator = lazy(() => import("./pages/admin/AdminSimulator"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/dashboard" element={<ProtectedRoute requiresApproved><Dashboard /></ProtectedRoute>} />
                <Route path="/packages" element={<ProtectedRoute requiresApproved><Packages /></ProtectedRoute>} />
                <Route path="/wallet" element={<ProtectedRoute requiresApproved><WalletPage /></ProtectedRoute>} />
                <Route path="/wallet/ledger" element={<ProtectedRoute requiresApproved><WalletLedger /></ProtectedRoute>} />
                <Route path="/payouts" element={<ProtectedRoute requiresApproved><Payouts /></ProtectedRoute>} />
                <Route path="/bank-details" element={<ProtectedRoute><BankDetails /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
                <Route path="/admin/packages" element={<ProtectedRoute adminOnly><AdminPackages /></ProtectedRoute>} />
                <Route path="/admin/payouts" element={<ProtectedRoute adminOnly><AdminPayouts /></ProtectedRoute>} />
                <Route path="/admin/roi-logs" element={<ProtectedRoute adminOnly><AdminROILogs /></ProtectedRoute>} />
                <Route path="/admin/simulator" element={<ProtectedRoute adminOnly><AdminSimulator /></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute adminOnly><AdminSettings /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
