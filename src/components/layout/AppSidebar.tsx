import {
  LayoutDashboard,
  Users,
  Sparkles,
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
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
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
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Contenido", url: "/content", icon: Sparkles },
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

export function AppSidebar() {
  const [searchParams] = useSearchParams();
  const paramResellerId = searchParams.get("reseller_id");

  // Persist reseller_id across navigation
  if (paramResellerId) {
    sessionStorage.setItem("omega_reseller_id", paramResellerId);
  }
  const resellerId = paramResellerId || sessionStorage.getItem("omega_reseller_id") || "";

  const agencyItems = resellerId
    ? [
        { title: "Mi Panel", url: `/reseller/dashboard?reseller_id=${resellerId}`, icon: PanelLeft },
        { title: "Editor de Landing", url: `/reseller/branding?reseller_id=${resellerId}`, icon: Palette },
      ]
    : [];

  const { data: health } = useQuery({
    queryKey: ["system-health-sidebar"],
    queryFn: () => api.systemHealth(),
    refetchInterval: 30000,
    retry: 1,
  });

  const isOnline = health && !health?.error;

  return (
    <Sidebar collapsible="icon">
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
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-1">
            <Shield className="h-3 w-3" /> Admin
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {agencyItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-1">
              <Palette className="h-3 w-3" /> Mi Agencia
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {agencyItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        className="hover:bg-sidebar-accent/50"
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      >
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
        <div className="flex items-center gap-2 rounded-lg bg-sidebar-accent/50 p-2 group-data-[collapsible=icon]:justify-center">
          <div className={`h-2 w-2 rounded-full shrink-0 ${isOnline ? 'bg-success' : 'bg-destructive'}`} />
          <span className="text-xs text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            {isOnline ? "Sistema activo" : "Sin conexión"}
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
