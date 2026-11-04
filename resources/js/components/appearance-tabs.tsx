
import { Moon, Sun } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const tabs: {
        value: Appearance;
        icon: typeof Sun;
        label: string;
    }[] = [
        { value: 'dark', icon: Moon, label: 'Dark Mode' },
        { value: 'light', icon: Sun, label: 'Light Mode' },
    ];

    return (
        <div
            className={cn(
                'inline-flex gap-1 rounded-xl border border-border bg-background p-1',
                className,
            )}
            {...props}
        >
            {tabs.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    type="button"
                    onClick={() => updateAppearance(value)}
                    aria-pressed={appearance === value}
                    className={cn(
                        'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
                        appearance === value
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    )}
                >
                    <Icon className="h-4 w-4" />
                    {label}
                </button>
            ))}
        </div>
    );
}
