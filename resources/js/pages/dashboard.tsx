
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowUpRight,
    Globe,
    KeyRound,
    ShieldCheck,
    Users,
    Clock3,
    LockKeyhole,
    CheckCircle2,
    Plus,
    LayoutDashboard,
} from 'lucide-react';

type DashboardProps = {
    stats: {
        totalManagers: number;
        totalWebsites: number;
        totalCredentials: number;
        totalActivities: number;
    };
    role: string;
    recentActivities: {
        id: number;
        user: string;
        action: string;
        credential: string;
        website: string;
        date: string;
    }[];
};

export default function Dashboard({
    stats,
    role = 'User',
    recentActivities = [],
}: DashboardProps) {
    const { auth } = usePage().props as unknown as {
        auth: {
            permissions: string[];
        };
    };

    const permissions = auth?.permissions ?? [];

    const cards = [
        {
            title: 'Total Managers',
            value: stats.totalManagers,
            description: 'Registered managers',
            icon: Users,
            iconClass: 'bg-blue-500/10 text-blue-500',
        },
        {
            title: 'Total Websites',
            value: stats.totalWebsites,
            description: 'Managed websites',
            icon: Globe,
            iconClass: 'bg-violet-500/10 text-violet-500',
        },
        {
            title: 'Total Credentials',
            value: stats.totalCredentials,
            description: 'Securely stored credentials',
            icon: KeyRound,
            iconClass: 'bg-emerald-500/10 text-emerald-500',
        },
        {
            title: 'Total Activities',
            value: stats.totalActivities,
            description: 'Recorded activities',
            icon: Activity,
            iconClass: 'bg-orange-500/10 text-orange-500',
        },
    ];

    const quickActions = [
        {
            title: 'Add Manager',
            description: 'Create a team member account',
            href: '/managers?create=1',
            permission: 'manager.create',
            icon: Users,
            iconClass: 'bg-blue-500/10 text-blue-500',
        },
        {
            title: 'Add Website',
            description: 'Register a new website',
            href: '/websites?create=1',
            permission: 'website.create',
            icon: Globe,
            iconClass: 'bg-violet-500/10 text-violet-500',
        },
        {
            title: 'Add Credential',
            description: 'Save a website login',
            href: '/credentials?create=1',
            permission: 'credential.create',
            icon: KeyRound,
            iconClass: 'bg-emerald-500/10 text-emerald-500',
        },
    ].filter((item) => permissions.includes(item.permission));

    const actionStyles: Record<string, string> = {
        created: 'bg-emerald-500/10 text-emerald-500',
        updated: 'bg-blue-500/10 text-blue-500',
        deleted: 'bg-red-500/10 text-red-500',
        password_viewed: 'bg-orange-500/10 text-orange-500',
    };

    return (
        <>
            <Head title="Dashboard" />

            <div className="min-w-0 space-y-7 bg-background p-4 text-foreground sm:p-6 lg:p-8">
                {/* Welcome Header */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                    <div className="absolute -right-16 -top-24 size-80 rounded-full bg-primary/10 blur-3xl" />
                    <div className="absolute -bottom-24 -left-16 size-64 rounded-full bg-blue-500/5 blur-3xl" />

                    <div className="relative flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
                        <div className="max-w-2xl">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                                <LayoutDashboard className="size-3.5" />
                                Workspace Overview
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Welcome to Credential Manager!
                            </h1>

                            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                                Manage your websites, organize login credentials and
                                monitor workspace activities from one secure place.
                            </p>

                            <div className="mt-5 flex flex-wrap items-center gap-3">
                                <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-500">
                                    <ShieldCheck className="size-4" />
                                    Secure Workspace
                                </span>

                                <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground">
                                    <Users className="size-4" />
                                    {String(role ?? 'User').replaceAll('-', ' ')}
                                </span>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center justify-center">
                            <div className="flex size-24 items-center justify-center rounded-3xl border border-primary/20 bg-primary/10 shadow-inner sm:size-28">
                                <ShieldCheck className="size-12 text-primary sm:size-14" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <section>
                    <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                        <div>
                            <div className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-primary">
                                Overview
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-foreground">
                                Workspace Statistics
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Monitor your workspace data at a glance.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {cards.map((stat, index) => {
                            const Icon = stat.icon;

                            return (
                                <div
                                    key={stat.title}
                                    className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                                >
                                    <div className="absolute right-0 top-0 h-1 w-full bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 opacity-0 transition-opacity group-hover:opacity-100" />

                                    <div className="flex items-center justify-between">
                                        <div className={`flex size-12 items-center justify-center rounded-2xl ${stat.iconClass}`}>
                                            <Icon className="size-5" />
                                        </div>

                                        <span className="text-xs font-medium text-muted-foreground">
                                            0{index + 1}
                                        </span>
                                    </div>

                                    <div className="mt-6">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {stat.title}
                                        </p>

                                        <div className="mt-2 flex items-end justify-between gap-2">
                                            <h3 className="text-3xl font-bold tracking-tight text-foreground tabular-nums">
                                                {stat.value.toLocaleString()}
                                            </h3>

                                            <ArrowUpRight className="mb-1 size-5 text-muted-foreground/50 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
                                        </div>

                                        <p className="mt-2 text-xs text-muted-foreground">
                                            {stat.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>



                {/* Quick Actions */}
                {quickActions.length > 0 && (
                    <section>
                        <div className="mb-5">
                            <div className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-primary">
                                Shortcuts
                            </div>
                            <h2 className="text-xl font-bold tracking-tight">
                                Quick Actions
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Common tasks to manage your workspace faster.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {quickActions.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.title}
                                        href={item.href}
                                        className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                                    >
                                        <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${item.iconClass} transition-transform duration-300 group-hover:scale-110`}>
                                            <Icon className="size-6" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-foreground">
                                                {item.title}
                                            </h3>
                                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                                {item.description}
                                            </p>
                                        </div>

                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                                            <Plus className="size-4" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}


                {/* Main Content */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                    {/* Recent Activities */}
                    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm xl:col-span-2">
                        <div className="flex flex-col justify-between gap-3 border-b border-border p-5 sm:flex-row sm:items-center">
                            <div>
                                <div className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-primary">
                                    Activity Monitor
                                </div>
                                <h2 className="text-lg font-bold text-foreground">
                                    Recent Activities
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Latest actions performed in your workspace.
                                </p>
                            </div>

                            <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground">
                                <Activity className="size-4 text-primary" />
                                Latest 5 activities
                            </div>
                        </div>

                        <div className="p-5">
                            {recentActivities.length > 0 ? (
                                <div className="space-y-5">
                                    {recentActivities.map((activity, index) => (
                                        <div key={activity.id} className="relative flex gap-4">
                                            {index !== recentActivities.length - 1 && (
                                                <div className="absolute left-5 top-11 h-full w-px bg-border" />
                                            )}

                                            <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
                                                <Activity className="size-4 text-primary" />
                                            </div>

                                            <div className="min-w-0 flex-1 pb-1">
                                                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="font-semibold text-foreground">
                                                            {activity.user}
                                                        </span>

                                                        <span
                                                            className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold capitalize ${actionStyles[activity.action] ??
                                                                'bg-muted text-muted-foreground'
                                                                }`}
                                                        >
                                                            {activity.action.replaceAll('_', ' ')}
                                                        </span>
                                                    </div>

                                                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Clock3 className="size-3.5" />
                                                        {activity.date}
                                                    </span>
                                                </div>

                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    <span className="font-medium text-foreground">
                                                        {activity.credential}
                                                    </span>
                                                    {' '}on{' '}
                                                    <span className="font-medium text-foreground">
                                                        {activity.website}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-muted">
                                        <Activity className="size-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="font-semibold text-foreground">
                                        No activities yet
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Workspace activities will appear here.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* System Overview */}
                    <section className="h-fit overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                        <div className="border-b border-border p-5">
                            <div className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-primary">
                                Workspace Health
                            </div>
                            <h2 className="text-lg font-bold text-foreground">
                                System Overview
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Your workspace at a glance.
                            </p>
                        </div>

                        <div className="space-y-4 p-5">
                            <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                                    <ShieldCheck className="size-5 text-emerald-500" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-foreground">
                                        Secure Workspace
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Credential management workspace
                                    </p>
                                </div>
                                <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
                            </div>

                            <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                                    <Users className="size-5 text-blue-500" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-foreground">
                                        User Role
                                    </p>
                                    <p className="mt-1 text-xs capitalize text-muted-foreground">
                                        {String(role ?? 'User').replaceAll('-', ' ')}
                                    </p>
                                </div>
                                <LockKeyhole className="size-5 shrink-0 text-muted-foreground" />
                            </div>

                            <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                                    <Globe className="size-5 text-violet-500" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-foreground">
                                        Websites
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {stats.totalWebsites.toLocaleString()} registered websites
                                    </p>
                                </div>
                                <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
                            </div>

                            <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10">
                                    <KeyRound className="size-5 text-orange-500" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-foreground">
                                        Credentials
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {stats.totalCredentials.toLocaleString()} stored credentials
                                    </p>
                                </div>
                                <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
