import { Link } from '@inertiajs/react';
import { useSidebar } from '@/components/ui/sidebar';

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();
    const { setOpenMobile, isMobile } = useSidebar();

    return (
        <SidebarGroup className="px-1 py-2">
            <SidebarGroupLabel className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-sidebar-foreground/45">
                Workspace
            </SidebarGroupLabel>

            <SidebarMenu className="gap-1.5">
                {items.map((item) => {
                    const active = isCurrentUrl(item.href);

                    return (
                        <SidebarMenuItem key={item.title} className="relative">
                            <SidebarMenuButton
                                asChild
                                isActive={active}
                                tooltip={{ children: item.title }}
                                className="
                                    relative h-11 rounded-xl px-3
                                    text-sm font-medium
                                    text-sidebar-foreground/70
                                    transition-all duration-200
                                    hover:translate-x-0.5
                                    hover:bg-sidebar-accent
                                    hover:text-sidebar-accent-foreground
                                    data-[active=true]:bg-sidebar-primary/10
                                    data-[active=true]:font-semibold
                                    data-[active=true]:text-sidebar-primary
                                    data-[active=true]:shadow-sm
                                "
                            >
                                <Link
                                    href={item.href}
                                    prefetch
                                    onClick={() => {
                                        if (isMobile) {
                                            setOpenMobile(false);
                                        }
                                    }}
                                >
                                    {active && (
                                        <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-sidebar-primary" />
                                    )}

                                    {item.icon && (
                                        <item.icon
                                            className={`size-[18px] shrink-0 transition-transform duration-200 ${active ? 'scale-110' : ''
                                                }`}
                                        />
                                    )}

                                    <span className="truncate">
                                        {item.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

