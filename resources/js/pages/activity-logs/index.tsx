
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search,
    History,
    User,
    Globe,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Filter,
} from 'lucide-react';

type Activity = {
    id: number;
    user_name: string;
    user_email: string | null;
    credential_title: string;
    website_name: string;
    action: string;
    ip_address: string | null;
    created_at: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    activities: {
        data: Activity[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
};

const actionStyles: Record<string, string> = {
    created: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    updated: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    deleted: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    password_viewed: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

export default function ActivityLogsIndex({ activities }: Props) {
    const [search, setSearch] = useState('');
    const [action, setAction] = useState('');

    function applyFilters() {
        router.get(
            '/activity-logs',
            {
                search: search || undefined,
                action: action || undefined,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    }

    function resetFilters() {
        setSearch('');
        setAction('');
        router.get('/activity-logs');
    }

    return (
        <>
            <Head title="Activity Logs" />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Activity Logs
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Monitor credential activities and security events.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 dark:border-gray-800 dark:bg-gray-900">
                        <History size={18} className="text-indigo-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {activities.total} Total Activities
                        </span>
                    </div>
                </div>

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
                                placeholder="Search user or credential..."
                                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            />
                        </div>

                        <select
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        >
                            <option value="">All Activities</option>
                            <option value="created">Created</option>
                            <option value="updated">Updated</option>
                            <option value="deleted">Deleted</option>
                            <option value="password_viewed">Password Viewed</option>
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
                            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-left text-sm">
                            <thead>
                                <tr className="border-b bg-gray-50 text-xs uppercase text-gray-500 dark:border-gray-800 dark:bg-gray-800/50">
                                    <th className="px-5 py-4">User</th>
                                    <th className="px-5 py-4">Activity</th>
                                    <th className="px-5 py-4">Credential</th>
                                    <th className="px-5 py-4">IP Address</th>
                                    <th className="px-5 py-4">Date & Time</th>
                                </tr>
                            </thead>

                            <tbody>
                                {activities.data.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/30"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30">
                                                    <User size={17} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {item.user_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {item.user_email || 'No email'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

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

                                        <td className="px-5 py-4">
                                            <p className="font-medium text-gray-800 dark:text-gray-200">
                                                {item.credential_title}
                                            </p>
                                            <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                                <Globe size={12} />
                                                {item.website_name}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4 font-mono text-xs text-gray-500">
                                            {item.ip_address || '—'}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                <CalendarDays size={15} />
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
                                            No activity logs found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

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
