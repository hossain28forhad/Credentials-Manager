
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    History,
    Search,
    Filter,
    RotateCcw,
    Fingerprint,
    DoorOpen,
    User,
    Globe,
    Monitor,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Activity,
    ShieldX,
} from 'lucide-react';

type LoginActivity = {
    id: number;
    user_name: string;
    email: string | null;
    action: 'login' | 'failed_login' | 'logout';
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    activities: {
        data: LoginActivity[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    stats: {
        total_login: number;
        failed_login: number;
        total_logout: number;
    };
};

const actionStyles: Record<string, string> = {
    login: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    failed_login: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    logout: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

function getBrowser(userAgent: string | null) {
    if (!userAgent) return 'Unknown Device';

    if (userAgent.includes('Edg/')) return 'Microsoft Edge';
    if (userAgent.includes('Chrome/')) return 'Google Chrome';
    if (userAgent.includes('Firefox/')) return 'Mozilla Firefox';
    if (userAgent.includes('Safari/')) return 'Safari';

    return 'Unknown Browser';
}

function getDevice(userAgent: string | null) {
    if (!userAgent) return 'Unknown Device';

    if (/mobile|android|iphone/i.test(userAgent)) {
        return 'Mobile Device';
    }

    if (/tablet|ipad/i.test(userAgent)) {
        return 'Tablet';
    }

    return 'Desktop';
}

export default function LoginHistoryIndex({ activities, stats }: Props) {
    const [search, setSearch] = useState('');
    const [action, setAction] = useState('');

    function applyFilters() {
        router.get(
            '/login-history',
            {
                search: search || undefined,
                action: action || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    }

    function resetFilters() {
        setSearch('');
        setAction('');

        router.get('/login-history', {}, {
            preserveState: true,
            replace: true,
        });
    }

    return (
        <>
            <Head title="Login History" />

            <div className="space-y-6 p-4 md:p-6">

                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <History className="text-indigo-600" size={25} />

                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Login History
                            </h1>
                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                            Monitor user login activities and security events.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 dark:border-gray-800 dark:bg-gray-900">
                        <Activity size={18} className="text-indigo-500" />

                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {activities.total} Total Records
                        </span>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Successful Logins
                                </p>

                                <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {stats.total_login}
                                </h2>
                            </div>

                            <div className="rounded-xl bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                <Fingerprint size={23} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Failed Logins
                                </p>

                                <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {stats.failed_login}
                                </h2>
                            </div>

                            <div className="rounded-xl bg-red-100 p-3 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                <ShieldX size={23} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Total Logouts
                                </p>

                                <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {stats.total_logout}
                                </h2>
                            </div>

                            <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <DoorOpen size={23} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex flex-col gap-3 md:flex-row">

                        <div className="relative flex-1">
                            <Search
                                size={18}
                                className="absolute left-3 top-3 text-gray-400"
                            />

                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') applyFilters();
                                }}
                                placeholder="Search user, email or IP..."
                                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            />
                        </div>

                        <select
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        >
                            <option value="">All Activities</option>
                            <option value="login">Successful Login</option>
                            <option value="failed_login">Failed Login</option>
                            <option value="logout">Logout</option>
                        </select>

                        <button
                            onClick={applyFilters}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            <Filter size={16} />
                            Filter
                        </button>

                        <button
                            onClick={resetFilters}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <RotateCcw size={15} />
                            Reset
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px] text-left text-sm">

                            <thead>
                                <tr className="border-b bg-gray-50 text-xs uppercase text-gray-500 dark:border-gray-800 dark:bg-gray-800/50">
                                    <th className="px-5 py-4">User</th>
                                    <th className="px-5 py-4">Activity</th>
                                    <th className="px-5 py-4">IP Address</th>
                                    <th className="px-5 py-4">Browser / Device</th>
                                    <th className="px-5 py-4">Date & Time</th>
                                </tr>
                            </thead>

                            <tbody>
                                {activities.data.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/30"
                                    >

                                        {/* User */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                                    <User size={18} />
                                                </div>

                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {item.user_name}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {item.email || 'Unknown Email'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Activity */}
                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                                    actionStyles[item.action] ||
                                                    'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {item.action.replaceAll('_', ' ')}
                                            </span>
                                        </td>

                                        {/* IP Address */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 font-mono text-xs text-gray-600 dark:text-gray-300">
                                                <Globe size={15} className="text-gray-400" />
                                                {item.ip_address || '—'}
                                            </div>
                                        </td>

                                        {/* Browser and Device */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <Monitor size={16} className="text-gray-400" />

                                                <div>
                                                    <p className="font-medium text-gray-700 dark:text-gray-200">
                                                        {getBrowser(item.user_agent)}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {getDevice(item.user_agent)}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Date */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                <CalendarDays size={15} className="text-gray-400" />

                                                {item.created_at}
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {activities.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-5 py-12 text-center text-gray-500"
                                        >
                                            No login activities found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table> 
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 px-5 py-4 dark:border-gray-800 sm:flex-row">

                        <p className="text-sm text-gray-500">
                            Showing {activities.from ?? 0} to {activities.to ?? 0}
                            {' '}of {activities.total} activities
                        </p>

                        <div className="flex flex-wrap items-center gap-1">
                            {activities.links.map((link, index) => (
                                <button
                                    key={index}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.visit(link.url)}
                                    className={`rounded-lg px-3 py-2 text-xs ${
                                        link.active
                                            ? 'bg-indigo-600 text-white'
                                            : 'border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                                    } disabled:cursor-not-allowed disabled:opacity-40`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
