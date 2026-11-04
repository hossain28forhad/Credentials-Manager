
import { Head, Link } from '@inertiajs/react';
import {
    ShieldCheck,
    LockKeyhole,
    Globe,
    Users,
    KeyRound,
    Activity,
    ArrowRight,
    CheckCircle2,
    Eye,
    Fingerprint,
    Menu,
} from 'lucide-react';
import { useState } from 'react';

const features = [
    {
        icon: Globe,
        title: 'Website Management',
        description:
            'Organize all your websites in one centralized workspace.',
    },
    {
        icon: KeyRound,
        title: 'Credential Management',
        description:
            'Store and manage website login credentials securely.',
    },
    {
        icon: Users,
        title: 'Team Management',
        description:
            'Manage team members with role-based access permissions.',
    },
    {
        icon: Activity,
        title: 'Activity Monitoring',
        description:
            'Keep track of important actions and account activities.',
    },
    {
        icon: Eye,
        title: 'Password Control',
        description:
            'View, copy and generate strong passwords when needed.',
    },
    {
        icon: Fingerprint,
        title: 'Access Control',
        description:
            'Control who can access different parts of your workspace.',
    },
];

export default function Welcome() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <Head title="Welcome | Credential Manager" />

            <div className="min-h-screen overflow-hidden bg-background text-foreground">
                {/* Header */}
                <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                                <ShieldCheck className="size-6" />
                            </div>
                            <div>
                                <h1 className="text-base font-bold tracking-tight">
                                    Credential Manager
                                </h1>
                                <p className="text-[10px] font-medium tracking-wider text-muted-foreground">
                                    SECURE WORKSPACE
                                </p>
                            </div>
                        </Link>

                        <nav className="hidden items-center gap-8 md:flex">
                            <a href="#features" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
                                Features
                            </a>
                            <a href="#security" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
                                Security
                            </a>
                            <a href="#about" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
                                About
                            </a>
                        </nav>

                        <div className="hidden items-center gap-3 md:flex">
                            <Link
                                href="/login"
                                className="rounded-lg px-4 py-2 text-sm font-semibold transition hover:bg-muted"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90"
                            >
                                Get Started
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>

                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="rounded-lg p-2 hover:bg-muted md:hidden"
                            aria-label="Toggle navigation menu"
                        >
                            <Menu className="size-6" />
                        </button>
                    </div>

                    {mobileMenuOpen && (
                        <div className="border-t border-border bg-background p-4 md:hidden">
                            <nav className="flex flex-col gap-3">
                                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-muted">
                                    Features
                                </a>
                                <a href="#security" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-muted">
                                    Security
                                </a>
                                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-muted">
                                    About
                                </a>
                                <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
                                    <Link href="/login" className="rounded-lg border border-border px-4 py-2.5 text-center text-sm font-semibold">
                                        Login
                                    </Link>
                                    <Link href="/register" className="rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground">
                                        Register
                                    </Link>
                                </div>
                            </nav>
                        </div>
                    )}
                </header>

                <main>
                    {/* Hero */}
                    <section className="relative">
                        <div className="pointer-events-none absolute -top-20 left-1/2 size-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

                        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:px-8">
                            <div>
                                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
                                    <ShieldCheck className="size-4" />
                                    Your Secure Credential Workspace
                                </div>

                                <h2 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                                    Manage Your
                                    <span className="block text-primary">
                                        Digital Access
                                    </span>
                                    With Confidence.
                                </h2>

                                <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
                                    A centralized workspace to manage websites,
                                    organize credentials, control team access
                                    and monitor activities — all in one place.
                                </p>

                                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/20 transition hover:-translate-y-0.5 hover:opacity-90"
                                    >
                                        Create Your Account
                                        <ArrowRight className="size-4" />
                                    </Link>

                                    <Link
                                        href="/login"
                                        className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-7 py-3.5 text-sm font-bold transition hover:bg-muted"
                                    >
                                        Sign In
                                    </Link>
                                </div>

                                <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-2">
                                        <CheckCircle2 className="size-4 text-emerald-500" />
                                        Organized Workspace
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <CheckCircle2 className="size-4 text-emerald-500" />
                                        Access Management
                                    </span>
                                </div>
                            </div>

                            {/* Dashboard Preview */}
                            <div className="relative mx-auto w-full max-w-xl">
                                <div className="absolute -inset-5 rounded-[2rem] bg-primary/10 blur-2xl" />

                                <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
                                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                                <ShieldCheck className="size-5" />
                                            </div>
                                            <span className="text-sm font-bold">
                                                Workspace Overview
                                            </span>
                                        </div>
                                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">
                                            Secure
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 p-5">
                                        {[
                                            { icon: Users, label: 'Managers', value: 'Team Access' },
                                            { icon: Globe, label: 'Websites', value: 'Organized' },
                                            { icon: KeyRound, label: 'Credentials', value: 'Protected' },
                                            { icon: Activity, label: 'Activities', value: 'Monitored' },
                                        ].map((item) => (
                                            <div key={item.label} className="rounded-xl border border-border bg-background p-4">
                                                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                    <item.icon className="size-5" />
                                                </div>
                                                <p className="text-sm font-semibold">{item.label}</p>
                                                <p className="mt-1 text-xs text-muted-foreground">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mx-5 mb-5 rounded-xl border border-border bg-background p-4">
                                        <div className="mb-4 flex items-center justify-between">
                                            <span className="text-sm font-semibold">
                                                Security Overview
                                            </span>
                                            <ShieldCheck className="size-5 text-emerald-500" />
                                        </div>
                                        <div className="space-y-3">
                                            {[
                                                'Role-based permissions',
                                                'Credential access control',
                                                'Activity history tracking',
                                            ].map((item) => (
                                                <div key={item} className="flex items-center gap-3 text-xs text-muted-foreground">
                                                    <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-t border-border bg-muted/30 px-5 py-3">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <LockKeyhole className="size-3.5 text-primary" />
                                            Your workspace, organized in one place.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features */}
                    <section id="features" className="border-y border-border bg-muted/20 py-20 sm:py-24">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto mb-14 max-w-2xl text-center">
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                                    Powerful Features
                                </span>
                                <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                                    Everything You Need to
                                    <span className="text-primary"> Stay Organized</span>
                                </h2>
                                <p className="mt-4 leading-7 text-muted-foreground">
                                    Manage your digital workspace with tools
                                    designed for visibility, organization and control.
                                </p>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {features.map((feature) => (
                                    <div
                                        key={feature.title}
                                        className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
                                    >
                                        <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                                            <feature.icon className="size-6" />
                                        </div>
                                        <h3 className="text-lg font-bold">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Security */}
                    <section id="security" className="py-20 sm:py-24">
                        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                                    Security & Control
                                </span>
                                <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                                    Keep Your Workspace
                                    <span className="block text-primary">
                                        Under Control.
                                    </span>
                                </h2>
                                <p className="mt-5 leading-8 text-muted-foreground">
                                    Manage access through permissions, keep track
                                    of activities and organize your credentials
                                    from a single workspace.
                                </p>

                                <div className="mt-7 space-y-4">
                                    {[
                                        'Role and permission management',
                                        'Credential activity monitoring',
                                        'Centralized website management',
                                        'Login history visibility',
                                    ].map((item) => (
                                        <div key={item} className="flex items-center gap-3 text-sm font-medium">
                                            <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-xl sm:p-10">
                                <div className="absolute -right-20 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />
                                <div className="relative">
                                    <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <ShieldCheck className="size-9" />
                                    </div>
                                    <h3 className="text-2xl font-bold">
                                        One Workspace.
                                        <br />
                                        Better Control.
                                    </h3>
                                    <p className="mt-4 leading-7 text-muted-foreground">
                                        Bring your website and credential
                                        management workflow together with
                                        clear access controls.
                                    </p>
                                    <div className="mt-8 rounded-xl border border-border bg-background p-4">
                                        <div className="flex items-center gap-3">
                                            <LockKeyhole className="size-5 text-primary" />
                                            <div>
                                                <p className="text-sm font-semibold">
                                                    Access Management
                                                </p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Organized permissions and visibility
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <section id="about" className="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
                        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground shadow-2xl shadow-primary/20 sm:px-12 sm:py-20">
                            <div className="absolute -left-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
                            <div className="absolute -bottom-32 -right-20 size-80 rounded-full bg-black/10 blur-3xl" />
                            <div className="relative">
                                <ShieldCheck className="mx-auto size-12" />
                                <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
                                    Ready to Organize Your Digital Workspace?
                                </h2>
                                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 opacity-80 sm:text-base">
                                    Get started with a centralized workspace
                                    for your websites, credentials and team access.
                                </p>
                                <Link
                                    href="/register"
                                    className="mt-8 inline-flex items-center gap-2 rounded-xl bg-background px-7 py-3.5 text-sm font-bold text-foreground transition hover:-translate-y-0.5 hover:shadow-xl"
                                >
                                    Get Started Now
                                    <ArrowRight className="size-4" />
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t border-border bg-card">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
                        <Link href="/" className="flex items-center gap-2">
                            <ShieldCheck className="size-6 text-primary" />
                            <span className="text-sm font-bold">
                                Credential Manager
                            </span>
                        </Link>

                        <p className="text-center text-xs text-muted-foreground">
                            © {new Date().getFullYear()} Credential Manager. All rights reserved.
                        </p>

                        <div className="flex items-center gap-5 text-sm">
                            <Link href="/login" className="text-muted-foreground transition hover:text-foreground">
                                Login
                            </Link>
                            <Link href="/register" className="text-muted-foreground transition hover:text-foreground">
                                Register
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
