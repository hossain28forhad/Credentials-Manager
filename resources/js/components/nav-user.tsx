
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';

import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';

export function NavUser() {
    const { auth } = usePage().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();

    if (!auth.user) {
        return null;
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="
                                h-14 rounded-xl border border-transparent
                                px-2 transition-all duration-200
                                hover:border-sidebar-border
                                hover:bg-sidebar-accent
                                data-[state=open]:border-sidebar-border
                                data-[state=open]:bg-sidebar-accent
                                data-[state=open]:text-sidebar-accent-foreground
                            "
                            data-test="sidebar-menu-button"
                        >
                            <UserInfo user={auth.user} />

                            <ChevronsUpDown className="ml-auto size-4 shrink-0 text-sidebar-foreground/50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="
                            w-(--radix-dropdown-menu-trigger-width)
                            min-w-56 rounded-xl border border-border
                            bg-popover p-1 text-popover-foreground shadow-xl
                        "
                        align="end"
                        side={
                            isMobile
                                ? 'bottom'
                                : state === 'collapsed'
                                  ? 'left'
                                  : 'bottom'
                        }
                        sideOffset={8}
                    >
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
