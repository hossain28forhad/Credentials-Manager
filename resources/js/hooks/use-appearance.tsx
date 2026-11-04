import { useSyncExternalStore } from 'react';

export type Appearance = 'light' | 'dark';
export type ResolvedAppearance = Appearance;

export type UseAppearanceReturn = {
    readonly appearance: Appearance;
    readonly resolvedAppearance: ResolvedAppearance;
    readonly updateAppearance: (mode: Appearance) => void;
};

const listeners = new Set<() => void>();
let currentAppearance: Appearance = 'dark';

const setCookie = (name: string, value: string, days = 365): void => {
    if (typeof document === 'undefined') return;

    const maxAge = days * 24 * 60 * 60;

    document.cookie =
        `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const getStoredAppearance = (): Appearance => {
    if (typeof window === 'undefined') return 'dark';

    const stored = localStorage.getItem('appearance');

    return stored === 'light' ? 'light' : 'dark';
};

const applyTheme = (appearance: Appearance): void => {
    if (typeof document === 'undefined') return;

    const isDark = appearance === 'dark';

    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = appearance;
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const notify = (): void => {
    listeners.forEach((listener) => listener());
};

export function initializeTheme(): void {
    if (typeof window === 'undefined') return;

    currentAppearance = getStoredAppearance();

    // Save default theme for first-time visitors.
    localStorage.setItem('appearance', currentAppearance);
    setCookie('appearance', currentAppearance);

    applyTheme(currentAppearance);
}

export function useAppearance(): UseAppearanceReturn {
    const appearance = useSyncExternalStore<Appearance>(
        subscribe,
        () => currentAppearance,
        (): Appearance => 'dark',
    );

    const updateAppearance = (mode: Appearance): void => {
        if (typeof window === 'undefined') return;

        currentAppearance = mode;

        localStorage.setItem('appearance', mode);
        setCookie('appearance', mode);

        applyTheme(mode);
        notify();
    };

    return {
        appearance,
        resolvedAppearance: appearance,
        updateAppearance,
    };
}
