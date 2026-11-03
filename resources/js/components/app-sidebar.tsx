import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    FolderGit2,
    LayoutGrid,
    Users,
    Globe,
    KeyRound,
    History,
} from 'lucide-react';

import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
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
            icon: LayoutGrid,
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

        // Websites and Credentials will be added
        ...(permissions.includes('website.view')
            ? [
                {
                    title: 'Websites',
                    href: '/websites',
                    icon: Globe,
                },
            ]
            : []),
        // when their backend modules are ready.
        ...(permissions.includes('credential.view')
            ? [{ title: 'Credentials', href: '/credentials', icon: KeyRound }]
            : []),
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: FolderGit2,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">

            {/* Sidebar Header */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Main Navigation */}
            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            {/* Sidebar Footer */}
            <SidebarFooter>
                <NavFooter
                    items={footerNavItems}
                    className="mt-auto"
                />

                <NavUser />
            </SidebarFooter>

        </Sidebar>
    );
}
