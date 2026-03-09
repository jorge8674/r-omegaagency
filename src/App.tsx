import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider as OmegaAuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/hooks/useTheme";
import { OmegaProtectedRoute } from "@/components/auth/OmegaProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { NovaChatWrapper } from "@/components/NovaChat/NovaChatWrapper";
import AuthLogin from "./pages/AuthLogin";
import AuthRegister from "./pages/AuthRegister";
import AuthReset from "./pages/AuthReset";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import OmegaDepartment from "./pages/OmegaDepartment/index";
import Clients from "./pages/Clients/index";
import AgentsPage from "./pages/Agents/index";
import ClientDetail from "./pages/ClientDetail/index";

import ContentLab from "./pages/ContentLab/index";
import ContextLibrary from "./pages/ContextLibrary/index";
import CalendarPage from "./pages/Calendar/index";
import Media from "./pages/Media";
import Analytics from "./pages/Analytics";
import CrisisRoom from "./pages/CrisisRoom";
import Competitive from "./pages/Competitive";
import Growth from "./pages/Growth";
import SettingsPage from "./pages/SettingsPage";
import AdminResellers from "./pages/AdminResellers";
import OmegaCompany from "./pages/OmegaCompany/index";
import ResellerDashboard from "./pages/ResellerDashboard";
import ResellerBranding from "./pages/ResellerBranding";
import ResellerDetail from "./pages/ResellerDetail/index";
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
            <NovaChatWrapper />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/auth/login" element={<AuthLogin />} />
              <Route path="/auth/register" element={<AuthRegister />} />
              <Route path="/auth/reset" element={<AuthReset />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/login" element={<Navigate to="/auth/login" replace />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/landing/:slug" element={<LandingPage />} />

              {/* Owner-only */}
              <Route path="/admin/resellers" element={
                <OmegaProtectedRoute allowedRoles={["owner"]}>
                  <AppLayout><AdminResellers /></AppLayout>
                </OmegaProtectedRoute>
              } />
              <Route path="/resellers/:id" element={
                <OmegaProtectedRoute allowedRoles={["owner"]}>
                  <AppLayout><ResellerDetail /></AppLayout>
                </OmegaProtectedRoute>
              } />
              <Route path="/omega" element={
                <OmegaProtectedRoute allowedRoles={["owner"]}>
                  <AppLayout><OmegaCompany /></AppLayout>
                </OmegaProtectedRoute>
              } />
              <Route path="/omega/department/:dept" element={
                <OmegaProtectedRoute allowedRoles={["owner"]}>
                  <AppLayout><OmegaDepartment /></AppLayout>
                </OmegaProtectedRoute>
              } />

              {/* Reseller + Owner */}
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
                { path: "/agents", el: <AgentsPage /> },
                
                { path: "/content-lab", el: <ContentLab /> },
                { path: "/context", el: <ContextLibrary /> },
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
