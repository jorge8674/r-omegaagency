import {
  LayoutDashboard,
  Users,
  Sparkles,
  FlaskConical,
  CalendarDays,
  BarChart3,
  Settings,
  AlertTriangle,
  Search,
  Rocket,
  Building2,
  Shield,
  PanelLeft,
  Palette,
  LogOut,
  User,
} from "lucide-react";
import { RaisenLogo } from "@/components/brand/RaisenLogo";
import { RaisenCircleLogo } from "@/components/brand/RaisenCircleLogo";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useOmegaAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Contenido", url: "/content", icon: Sparkles },
  { title: "Content Lab", url: "/content-lab", icon: FlaskConical },
  { title: "Calendario", url: "/calendar", icon: CalendarDays },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Competitive", url: "/competitive", icon: Search },
  { title: "Crisis Room", url: "/crisis", icon: AlertTriangle },
  { title: "Growth", url: "/growth", icon: Rocket },
];

const configItems = [
  { title: "Clientes", url: "/clients", icon: Users },
  { title: "Configuración", url: "/settings", icon: Settings },
];

const adminItems = [
  { title: "Resellers", url: "/admin/resellers", icon: Building2 },
];

const agencyItems = [
  { title: "Mi Panel", url: "/reseller/dashboard", icon: PanelLeft },
  { title: "Editor de Landing", url: "/reseller/branding", icon: Palette },
];

export function AppSidebar() {
  const { user, logout } = useOmegaAuth();
  const navigate = useNavigate();
  const { setOpen, state } = useSidebar();
  const { avatarUrl } = useProfile();
  const role = user?.role;

  const { data: health } = useQuery({
    queryKey: ["system-health-sidebar"],
    queryFn: () => api.systemHealth(),
    refetchInterval: 30000,
    retry: 1,
  });

  const isOnline = health && !health?.error;

  const showMain = role === "owner" || role === "reseller" || role === "agent";
  const showConfig = role === "owner" || role === "reseller" || role === "agent";
  const showAdmin = role === "owner";
  const showAgency = role === "reseller";

  const handleNavClick = () => {
    setOpen(false);
  };

  const handleSidebarEnter = () => {
    if (state === "collapsed") {
      setOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Sidebar collapsible="icon" onMouseEnter={handleSidebarEnter}>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <RaisenLogo size="md" className="text-sidebar-accent-foreground" />
            <span className="text-[10px] text-sidebar-foreground mt-0.5 uppercase tracking-widest">
              OMEGA
            </span>
          </div>
          <div className="hidden group-data-[collapsible=icon]:block">
            <RaisenCircleLogo size={32} />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {showMain && (
          <SidebarGroup>
            <SidebarGroupLabel>Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink to={item.url} onClick={handleNavClick} className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {showConfig && (
          <SidebarGroup>
            <SidebarGroupLabel>Sistema</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {configItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink to={item.url} onClick={handleNavClick} className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {showAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-1">
              <Shield className="h-3 w-3" /> Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink to={item.url} onClick={handleNavClick} className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {showAgency && (
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-1">
              <Palette className="h-3 w-3" /> Mi Agencia
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {agencyItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink to={item.url} onClick={handleNavClick} className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3 group-data-[collapsible=icon]:p-2">
        {user && (
          <div className="rounded-lg border border-border/50 bg-sidebar-accent/30 p-2 group-data-[collapsible=icon]:p-1">
            {/* Avatar + info */}
            <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
              <Avatar className="h-8 w-8 shrink-0">
                {avatarUrl && <AvatarImage src={avatarUrl} alt="Avatar" />}
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="text-xs font-medium text-sidebar-foreground truncate">{user.email}</p>
                <span className="inline-block mt-0.5 rounded-full bg-primary/10 border border-primary/30 px-2 py-0.5 text-[9px] font-semibold text-primary uppercase tracking-wider">
                  {user.role === "owner" ? "Super Admin" : user.role === "reseller" ? "Agencia" : user.role === "agent" ? "Agente" : "Cliente"}
                </span>
              </div>
            </div>

            {/* Profile + Logout on same line */}
            <div className="flex items-center gap-1 mt-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:mt-1">
              <NavLink
                to="/settings"
                onClick={handleNavClick}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
                activeClassName="text-primary"
              >
                <User className="h-3.5 w-3.5" />
                <span className="group-data-[collapsible=icon]:hidden">Perfil</span>
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="group-data-[collapsible=icon]:hidden">Salir</span>
              </button>
            </div>
          </div>
        )}

        {/* System status - at the very bottom */}
        <div className="flex items-center gap-2 rounded-lg bg-sidebar-accent/50 p-2 group-data-[collapsible=icon]:justify-center mt-1">
          <div className={`h-2 w-2 rounded-full shrink-0 ${isOnline ? 'bg-success' : 'bg-destructive'}`} />
          <span className="text-xs text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            {isOnline ? "Sistema activo" : "Sin conexión"}
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
