import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';


type StatusFilter = 'all' | 'pending' | 'active' | 'suspended' | 'rejected';

type User = {
    id: number;
    name: string;
    email: string;
    status: string;
    role: string | null;
    emailVerified: boolean;
    createdAt: string | null;
};

type Props = {
    users: User[];
};

export default function UserIndex({ users }: Props) {

    const [search, setSearch] = useState('');

    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>('all');

    const filteredUsers = users.filter((user) => {
        const matchesSearch = `${user.name} ${user.email} ${user.role ?? ''}`
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' || user.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const pendingUsers = users.filter(
        (user) => user.status === 'pending',
    ).length;

    const activeUsers = users.filter(
        (user) => user.status === 'active',
    ).length;

    const suspendedUsers = users.filter(
        (user) => user.status === 'suspended',
    ).length;

    const inputClass =
        'w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20';

    return (
        <>
            <Head title="User Management" />

            <div className="min-h-full w-full min-w-0 space-y-6 bg-background p-4 text-foreground transition-colors sm:p-6 lg:p-8">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        User Management
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage registered users and their account status.
                    </p>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">

                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">
                            Total Users
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-card-foreground">
                            {users.length}
                        </h2>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">
                            Pending
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-400">
                            {pendingUsers}
                        </h2>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">
                            Active
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                            {activeUsers}
                        </h2>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">
                            Suspended
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
                            {suspendedUsers}
                        </h2>
                    </div>

                </div>

                {/* User Table */}
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">

                    <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">

                        <div>
                            <h2 className="font-semibold text-card-foreground">
                                All Users
                            </h2>

                            <p className="mt-1 text-xs text-muted-foreground">
                                View registered users and their current status.
                            </p>
                        </div>

                        <input
                            type="search"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`${inputClass} w-full sm:w-64`}
                        />

                        <div className="flex flex-wrap gap-2">
                            {(['all', 'pending', 'active', 'suspended', 'rejected'] as StatusFilter[]).map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => setStatusFilter(status)}
                                    className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${statusFilter === status
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                        }`}
                                >
                                    {status === 'all' ? 'All Users' : status}
                                </button>
                            ))}
                        </div>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full text-left text-sm">

                            <thead className="bg-muted/70 text-xs uppercase text-muted-foreground">

                                <tr>
                                    <th className="px-6 py-4 text-left">
                                        User
                                    </th>

                                    <th className="px-6 py-4 text-left">
                                        Role
                                    </th>

                                    <th className="px-6 py-4 text-left">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-left">
                                        Email
                                    </th>

                                    <th className="px-6 py-4 text-left">
                                        Registered
                                    </th>

                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>

                            </thead>

                            <tbody className="divide-y divide-border">

                                {filteredUsers.map((user) => (

                                    <tr
                                        key={user.id}
                                        className="transition-colors duration-200 hover:bg-muted/60"
                                    >

                                        {/* User */}
                                        <td className="px-6 py-4">

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                                                    {user.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <div>
                                                    <p className="font-medium text-card-foreground">
                                                        {user.name}
                                                    </p>

                                                    <p className="text-xs text-muted-foreground">
                                                        {user.email}
                                                    </p>
                                                </div>

                                            </div>

                                        </td>

                                        {/* Role */}
                                        <td className="px-6 py-4">

                                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                                {user.role ?? 'No Role'}
                                            </span>

                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">

                                            {user.status === 'pending' && (
                                                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                                                    Pending
                                                </span>
                                            )}

                                            {user.status === 'active' && (
                                                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                                    Active
                                                </span>
                                            )}

                                            {user.status === 'suspended' && (
                                                <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-700 dark:text-red-400">
                                                    Suspended
                                                </span>
                                            )}

                                            {user.status === 'rejected' && (
                                                <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-700 dark:text-red-400">
                                                    Rejected
                                                </span>
                                            )}

                                        </td>

                                        {/* Email verification */}
                                        <td className="px-6 py-4">

                                            {user.emailVerified ? (
                                                <span className="text-emerald-600 dark:text-emerald-400">
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="text-amber-600 dark:text-amber-400">
                                                    Not Verified
                                                </span>
                                            )}

                                        </td>

                                        {/* Created */}
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {user.createdAt ?? '—'}
                                        </td>


                                        {/* Actions */}

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            {user.status === 'pending' ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (confirm(`Approve ${user.name}?`)) {
                                                                router.post(`/users/${user.id}/approve`);
                                                            }
                                                        }}
                                                        className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors duration-200 hover:bg-green-700 cursor-pointer"
                                                    >
                                                        Approve
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (confirm(`Reject ${user.name}?`)) {
                                                                router.post(`/users/${user.id}/reject`);
                                                            }
                                                        }}
                                                        className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors duration-200 hover:bg-red-700 cursor-pointer"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : user.status === 'active' ? (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (confirm(`Suspend ${user.name}?`)) {
                                                            router.post(`/users/${user.id}/suspend`);
                                                        }
                                                    }}
                                                    className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors duration-200 hover:bg-red-700 cursor-pointer"
                                                >
                                                    Suspend
                                                </button>
                                            ) : user.status === 'suspended' || user.status === 'rejected' ? (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (confirm(`Activate ${user.name}?`)) {
                                                            router.post(`/users/${user.id}/activate`);
                                                        }
                                                    }}
                                                    className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors duration-200 hover:bg-green-700 cursor-pointer"
                                                >
                                                    Activate
                                                </button>
                                            ) : null}
                                        </td>

                                    </tr>

                                ))}

                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-16 text-center"
                                        >
                                            <p className="font-medium text-card-foreground">
                                                No users found
                                            </p>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                No registered users match your search.
                                            </p>
                                        </td>
                                    </tr>
                                )}

                            </tbody>

                        </table>

                    </div>

                    <div className="border-t border-border px-6 py-4 text-xs text-muted-foreground">
                        Showing {filteredUsers.length} of {users.length} users
                    </div>

                </div>

            </div>
        </>
    );
}