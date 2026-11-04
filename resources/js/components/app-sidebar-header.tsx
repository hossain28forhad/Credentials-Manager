import { Moon, Sun } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAppearance } from '@/hooks/use-appearance';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { appearance, updateAppearance } = useAppearance();

    const isDark = appearance === 'dark';

    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-4 transition-colors sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
                <SidebarTrigger className="-ml-1 text-foreground hover:bg-accent" />

                <div className="h-5 w-px bg-border" />

                <div className="min-w-0">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() =>
                        updateAppearance(isDark ? 'light' : 'dark')
                    }
                    aria-label={
                        isDark ? 'Switch to light mode' : 'Switch to dark mode'
                    }
                    title={isDark ? 'Light Mode' : 'Dark Mode'}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                >
                    {isDark ? (
                        <Sun className="h-4 w-4" />
                    ) : (
                        <Moon className="h-4 w-4" />
                    )}
                </button>
            </div>
        </header>
    );
}

