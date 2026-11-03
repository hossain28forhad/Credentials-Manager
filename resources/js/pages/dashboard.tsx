
import { Head } from '@inertiajs/react';

const stats = [
    {
        title: 'Total Managers',
        value: '0',
        description: 'Registered managers',
        icon: '👥',
        color: 'bg-blue-50 text-blue-600',
    },
    {
        title: 'Total Websites',
        value: '0',
        description: 'Managed websites',
        icon: '🌐',
        color: 'bg-purple-50 text-purple-600',
    },
    {
        title: 'Total Credentials',
        value: '0',
        description: 'Stored credentials',
        icon: '🔐',
        color: 'bg-green-50 text-green-600',
    },
    {
        title: 'Activities',
        value: '0',
        description: 'Recorded activities',
        icon: '📊',
        color: 'bg-orange-50 text-orange-600',
    },
];

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />

            <div className="w-full min-w-0 space-y-8 p-4 sm:p-6 lg:p-8">

                {/* Page Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white-900">
                            Dashboard
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Welcome back! Here's your system overview.
                        </p>
                    </div>

                    <div className="rounded-lg border bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
                        Admin Panel
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.title}
                            className="min-w-0 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-medium text-gray-500">
                                    {stat.title}
                                </p>

                                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${stat.color}`}>
                                    {stat.icon}
                                </div>
                            </div>

                            <h2 className="mt-5 text-3xl font-bold text-gray-900">
                                {stat.value}
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
                    <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Recent Activities
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Latest system activities
                                </p>
                            </div>
                        </div>

                        <div className="flex min-h-64 flex-col items-center justify-center text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                                📋
                            </div>

                            <h3 className="mt-4 font-medium text-gray-800">
                                No activities yet
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Your recent activities will appear here.
                            </p>
                        </div>
                    </div>

                    {/* System Overview */}
                    <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">
                            System Overview
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Current system information
                        </p>

                        <div className="mt-6 space-y-5">

                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm text-gray-600">
                                    System Status
                                </span>
                                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                    Active
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm text-gray-600">
                                    Your Role
                                </span>
                                <span className="text-sm font-semibold text-gray-900">
                                    Super Admin
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm text-gray-600">
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
