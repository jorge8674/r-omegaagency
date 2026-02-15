import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider as OmegaAuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/hooks/useTheme";
import { OmegaProtectedRoute } from "@/components/auth/OmegaProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import ContentGenerator from "./pages/ContentGenerator";
import CalendarPage from "./pages/Calendar";
import Media from "./pages/Media";
import Analytics from "./pages/Analytics";
import CrisisRoom from "./pages/CrisisRoom";
import Competitive from "./pages/Competitive";
import Growth from "./pages/Growth";
import SettingsPage from "./pages/SettingsPage";
import AdminResellers from "./pages/AdminResellers";
import ResellerDashboard from "./pages/ResellerDashboard";
import ResellerBranding from "./pages/ResellerBranding";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import Pricing from "./pages/Pricing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <OmegaAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/landing/:slug" element={<LandingPage />} />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Owner-only */}
              <Route path="/admin/resellers" element={
                <OmegaProtectedRoute allowedRoles={["owner"]}>
                  <AppLayout><AdminResellers /></AppLayout>
                </OmegaProtectedRoute>
              } />

              {/* Reseller + Owner (owner can view reseller dashboards) */}
              <Route path="/reseller/dashboard" element={
                <OmegaProtectedRoute allowedRoles={["owner", "reseller"]}>
                  <AppLayout><ResellerDashboard /></AppLayout>
                </OmegaProtectedRoute>
              } />
              <Route path="/reseller/branding" element={
                <OmegaProtectedRoute allowedRoles={["owner", "reseller"]}>
                  <AppLayout><ResellerBranding /></AppLayout>
                </OmegaProtectedRoute>
              } />

              {/* Owner + reseller + agent */}
              <Route path="/dashboard" element={
                <OmegaProtectedRoute allowedRoles={["owner", "reseller", "agent"]}>
                  <AppLayout><Dashboard /></AppLayout>
                </OmegaProtectedRoute>
              } />

              {/* General protected */}
              {[
                { path: "/clients", el: <Clients /> },
                { path: "/clients/:id", el: <ClientDetail /> },
                { path: "/content", el: <ContentGenerator /> },
                { path: "/calendar", el: <CalendarPage /> },
                { path: "/media", el: <Media /> },
                { path: "/analytics", el: <Analytics /> },
                { path: "/crisis", el: <CrisisRoom /> },
                { path: "/competitive", el: <Competitive /> },
                { path: "/growth", el: <Growth /> },
                { path: "/settings", el: <SettingsPage /> },
              ].map(({ path, el }) => (
                <Route key={path} path={path} element={
                  <OmegaProtectedRoute allowedRoles={["owner", "reseller", "agent"]}>
                    <AppLayout>{el}</AppLayout>
                  </OmegaProtectedRoute>
                } />
              ))}

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </OmegaAuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
