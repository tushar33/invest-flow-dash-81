import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getPostAuthPath, isOnboardingComplete } from "@/lib/onboarding";

export function ProtectedRoute({
  children,
  adminOnly = false,
  requiresApproved = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
  requiresApproved?: boolean;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "ADMIN") return <Navigate to="/dashboard" replace />;
  if (requiresApproved && !isOnboardingComplete(user)) {
    return <Navigate to={getPostAuthPath(user)} replace />;
  }

  return <>{children}</>;
}
