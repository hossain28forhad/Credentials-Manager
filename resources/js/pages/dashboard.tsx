
import { Head } from '@inertiajs/react';

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

const statConfig = [
    {
        title: 'Total Managers',
        key: 'totalManagers',
        description: 'Registered managers',
        icon: '👥',
        color: 'bg-blue-50 text-blue-600',
    },
    {
        title: 'Total Websites',
        key: 'totalWebsites',
        description: 'Managed websites',
        icon: '🌐',
        color: 'bg-purple-50 text-purple-600',
    },
    {
        title: 'Total Credentials',
        key: 'totalCredentials',
        description: 'Stored credentials',
        icon: '🔐',
        color: 'bg-green-50 text-green-600',
    },
    {
        title: 'Activities',
        key: 'totalActivities',
        description: 'Recorded activities',
        icon: '📊',
        color: 'bg-orange-50 text-orange-600',
    },
] as const;

const actionStyles: Record<string, string> = {
    created: 'bg-green-50 text-green-700',
    updated: 'bg-blue-50 text-blue-700',
    deleted: 'bg-red-50 text-red-700',
    password_viewed: 'bg-orange-50 text-orange-700',
};

export default function Dashboard({
    stats = {
        totalManagers: 0,
        totalWebsites: 0,
        totalCredentials: 0,
        totalActivities: 0,
    },
    role = 'User',
    recentActivities = [],
}: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="w-full min-w-0 space-y-8 p-4 sm:p-6 lg:p-8">

                {/* Page Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Dashboard
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Welcome back! Here's your system overview.
                        </p>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                        Admin Panel
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {statConfig.map((stat) => (
                        <div
                            key={stat.key}
                            className="min-w-0 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-medium text-gray-500">
                                    {stat.title}
                                </p>

                                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${stat.color}`}>
                                    {stat.icon}
                                </div>
                            </div>

                            <h2 className="mt-5 text-3xl font-bold text-gray-900 dark:text-white">
                                {stats[stat.key].toLocaleString()}
                            </h2>

                            <p className="mt-2 text-xs text-gray-500">
                                {stat.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Dashboard Content */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                    {/* Recent Activities */}
                    <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-2">

                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Recent Activities
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Latest system activities
                            </p>
                        </div>

                        {recentActivities.length > 0 ? (
                            <div className="mt-6 space-y-4">
                                {recentActivities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex flex-col justify-between gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0 dark:border-gray-800 sm:flex-row sm:items-center"
                                    >
                                        <div className="flex min-w-0 items-start gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-lg dark:bg-indigo-900/30">
                                                📋
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {activity.user}
                                                </p>

                                                <p className="mt-1 truncate text-sm text-gray-500">
                                                    {String(activity.action ?? 'unknown').replaceAll('_', ' ')}
                                                    {' '}— {activity.credential}
                                                </p>

                                                <p className="mt-1 text-xs text-gray-400">
                                                    {activity.website}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                    actionStyles[activity.action] ??
                                                    'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {String(activity.action ?? 'unknown').replaceAll('_', ' ')}
                                            </span>

                                            <span className="text-xs text-gray-400">
                                                {activity.date}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex min-h-64 flex-col items-center justify-center text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl dark:bg-gray-800">
                                    📋
                                </div>

                                <h3 className="mt-4 font-medium text-gray-800 dark:text-white">
                                    No activities yet
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    Your recent activities will appear here.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* System Overview */}
                    <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">

                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            System Overview
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Current system information
                        </p>

                        <div className="mt-6 space-y-5">

                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    System Status
                                </span>
                                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                    Active
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Your Role
                                </span>
                                <span className="text-sm font-semibold capitalize text-gray-900 dark:text-white">
                                    {String(role ?? 'User').replaceAll('-', ' ')}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Authentication
                                </span>
                                <span className="text-sm font-semibold text-green-600">
                                    Enabled
                                </span>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
