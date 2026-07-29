import { HugeiconsIcon } from "@hugeicons/react";
import {
  Hotel01Icon,
  LaptopIcon,
  Logout02Icon,
  Moon02Icon,
  Sun03Icon,
} from "@hugeicons/core-free-icons";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { appConfig } from "~/app/app-config";
import {
  getPageTitle,
  isNavigationItemActive,
  navigationItems,
} from "~/app/route-registry";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "~/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { dashboardPaths } from "~/features/dashboard/routes/dashboard-paths";
import { useAuth } from "~/features/auth/context/auth-provider";
import { trackEvent } from "~/lib/analytics";

function Navigation() {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup className="px-3 group-data-[collapsible=icon]:px-2">
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {navigationItems.map((item) => {
            const isActive = isNavigationItemActive(item, location.pathname);

            return (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton
                  className="h-10 rounded-lg px-3 text-sm data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground data-active:shadow-sm hover:data-active:bg-sidebar-primary hover:data-active:text-sidebar-primary-foreground"
                  isActive={isActive}
                  render={
                    <NavLink
                      end={item.end}
                      onClick={() => setOpenMobile(false)}
                      to={item.to}
                    />
                  }
                  tooltip={item.label}
                >
                  <HugeiconsIcon icon={item.icon} size={18} strokeWidth={2} />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function AppSidebar() {
  const { session } = useAuth();
  const operator = session?.user ?? appConfig.operator;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-5 group-data-[collapsible=icon]:px-2">
        <NavLink
          className="flex items-center gap-3 overflow-hidden"
          aria-label={`${appConfig.brand.name} overview`}
          to={dashboardPaths.overview}
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:rounded-lg">
            <HugeiconsIcon icon={Hotel01Icon} size={20} strokeWidth={2} />
          </span>
          <span className="min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="block font-heading text-base font-bold tracking-tight">
              {appConfig.brand.name}
            </span>
            <span className="block text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              {appConfig.brand.tagline}
            </span>
          </span>
        </NavLink>
      </SidebarHeader>

      <SidebarContent className="pt-3">
        <Navigation />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-14 rounded-xl bg-sidebar-accent/70 px-3 hover:bg-sidebar-accent group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0!"
              size="lg"
              tooltip={`${operator.name} · ${operator.role}`}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary group-data-[collapsible=icon]:size-8">
                {operator.initials}
              </span>
              <span className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <span className="block truncate text-sm font-semibold">
                  {operator.name}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {operator.role}
                </span>
              </span>
              <span
                className="ml-auto size-2 rounded-full bg-emerald-500 group-data-[collapsible=icon]:hidden"
                title="Online"
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

type Theme = "light" | "dark" | "system";

const themeOptions = [
  { icon: Sun03Icon, label: "Light", value: "light" },
  { icon: Moon02Icon, label: "Dark", value: "dark" },
  { icon: LaptopIcon, label: "Follow system", value: "system" },
] as const satisfies ReadonlyArray<{
  icon: typeof Sun03Icon;
  label: string;
  value: Theme;
}>;

function isTheme(value: string | null): value is Theme {
  return themeOptions.some((option) => option.value === value);
}

function ThemeSelector() {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(appConfig.themeStorageKey);
    return isTheme(savedTheme) ? savedTheme : "system";
  });

  useEffect(() => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const isDark =
        theme === "dark" || (theme === "system" && systemTheme.matches);
      document.documentElement.classList.toggle("dark", isDark);
    };

    applyTheme();
    localStorage.setItem(appConfig.themeStorageKey, theme);

    if (theme !== "system") return;

    systemTheme.addEventListener("change", applyTheme);
    return () => systemTheme.removeEventListener("change", applyTheme);
  }, [theme]);

  const selectedTheme =
    themeOptions.find((option) => option.value === theme) ?? themeOptions[2];

  return (
    <Select
      onValueChange={(value) => {
        if (isTheme(value)) setTheme(value);
      }}
      value={theme}
    >
      <SelectTrigger
        aria-label={`Theme: ${selectedTheme.label}`}
        className="h-8 rounded-lg border-0 px-2 hover:bg-muted"
      >
        <SelectValue>
          <HugeiconsIcon icon={selectedTheme.icon} size={18} strokeWidth={2} />
          <span className="sr-only">{selectedTheme.label}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end" alignItemWithTrigger={false}>
        {themeOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <HugeiconsIcon icon={option.icon} size={16} strokeWidth={2} />
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function AppShell() {
  const auth = useAuth();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const lastTrackedPath = useRef<string>(undefined);

  useEffect(() => {
    if (lastTrackedPath.current === location.pathname) return;

    lastTrackedPath.current = location.pathname;
    trackEvent({ name: "page_viewed", path: location.pathname });
  }, [location.pathname]);

  return (
    <SidebarProvider>
      <a
        className="sr-only z-[110] rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        href="#main-content"
      >
        Skip to content
      </a>

      <AppSidebar />

      <SidebarInset className="min-w-0 bg-muted/35">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b bg-background/90 px-4 backdrop-blur md:px-6 lg:px-8">
          <SidebarTrigger className="mr-2" />
          <div className="mr-3 h-4 w-px bg-border" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold">{pageTitle}</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              {appConfig.hotel.name} · {appConfig.hotel.location}
            </p>
          </div>

          <div className="ml-auto flex items-center">
            <ThemeSelector />
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    aria-label="Sign out"
                    disabled={auth.isLoggingOut}
                    onClick={() => void auth.logout()}
                    size="icon"
                    variant="ghost"
                  />
                }
              >
                <HugeiconsIcon icon={Logout02Icon} size={18} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Sign out</TooltipContent>
            </Tooltip>
          </div>
        </header>

        <div
          className="mx-auto w-full max-w-[1600px] flex-1 p-4 md:p-6 lg:p-8"
          id="main-content"
        >
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
