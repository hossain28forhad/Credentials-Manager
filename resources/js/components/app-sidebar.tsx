
import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    Globe,
    History,
    KeyRound,
    LayoutDashboard,
    Users,
    ShieldCheck,
} from 'lucide-react';

import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props as unknown as {
        auth: {
            permissions: string[];
        };
    };

    const permissions = auth?.permissions ?? [];

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutDashboard,
        },

        ...(permissions.includes('manager.view')
            ? [
                  {
                      title: 'Managers',
                      href: '/managers',
                      icon: Users,
                  },
              ]
            : []),

        ...(permissions.includes('website.view')
            ? [
                  {
                      title: 'Websites',
                      href: '/websites',
                      icon: Globe,
                  },
              ]
            : []),

        ...(permissions.includes('credential.view')
            ? [
                  {
                      title: 'Credentials',
                      href: '/credentials',
                      icon: KeyRound,
                  },
              ]
            : []),

        ...(permissions.includes('activity.view')
            ? [
                  {
                      title: 'Activity Logs',
                      href: '/activity-logs',
                      icon: Activity,
                  },
              ]
            : []),

        ...(permissions.includes('login-activity.view')
            ? [
                  {
                      title: 'Login History',
                      href: '/login-history',
                      icon: History,
                  },
              ]
            : []),
    ];

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="border-r border-sidebar-border bg-sidebar"
        >
            {/* Brand Header */}
            <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="h-12 rounded-xl px-2 transition-colors hover:bg-sidebar-accent"
                        >
                            <Link href={dashboard()} prefetch>
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
                                    <ShieldCheck className="size-5" />
                                </div>

                                <div className="ml-1 grid min-w-0 flex-1 text-left">
                                    <span className="truncate text-sm font-bold tracking-tight text-sidebar-foreground">
                                        Credential Manager
                                    </span>
                                    <span className="truncate text-[11px] text-sidebar-foreground/60">
                                        Secure Workspace
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Navigation */}
            <SidebarContent className="px-2 py-5">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            {/* User Profile */}
            <SidebarFooter className="border-t border-sidebar-border p-3">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
