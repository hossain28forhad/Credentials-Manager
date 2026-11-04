import { useEffect, useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';

type Manager = {
    id: number;
    name: string;
    email: string;
    permissions: string[];
};

type Props = {
    managers: Manager[];
    availablePermissions: string[];
    can: {
        create: boolean;
        edit: boolean;
        delete: boolean;
    };
};

type ManagerForm = {
    name: string;
    email: string;
    password: string;
    permissions: string[];
};

export default function ManagerIndex({
    managers,
    availablePermissions,
    can,
}: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingManager, setEditingManager] = useState<Manager | null>(null);
    const [search, setSearch] = useState('');

    const form = useForm<ManagerForm>({
        name: '',
        email: '',
        password: '',
        permissions: [],
    });

    const { url } = usePage();

    useEffect(() => {
        const params = new URLSearchParams(url.split('?')[1] ?? '');

        if (params.get('create') === '1' && can.create) {
            setEditingManager(null);
            form.reset();
            form.clearErrors();
            setModalOpen(true);
        }
    }, [url, can.create]);

    const filteredManagers = managers.filter((manager) =>
        `${manager.name} ${manager.email}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const openCreateModal = () => {
        setEditingManager(null);
        form.reset();
        form.clearErrors();
        setModalOpen(true);
    };

    const openEditModal = (manager: Manager) => {
        setEditingManager(manager);
        form.clearErrors();

        form.setData({
            name: manager.name,
            email: manager.email,
            password: '',
            permissions: [...manager.permissions],
        });

        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingManager(null);
        form.reset();
        form.clearErrors();
    };

    const togglePermission = (permission: string) => {
        const selected = form.data.permissions;

        form.setData(
            'permissions',
            selected.includes(permission)
                ? selected.filter((item) => item !== permission)
                : [...selected, permission]
        );
    };

    const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (editingManager) {
            form.put(`/managers/${editingManager.id}`, {
                onSuccess: closeModal,
            });
        } else {
            form.post('/managers', {
                onSuccess: closeModal,
            });
        }
    };

    const deleteManager = (manager: Manager) => {
        if (!window.confirm(`Are you sure you want to delete ${manager.name}?`)) {
            return;
        }

        router.delete(`/managers/${manager.id}`);
    };

    const inputClass =
        'w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20';

    const labelClass = 'mb-2 block text-sm font-medium text-foreground';

    return (
        <>
            <Head title="Managers" />

            <div className="min-h-full w-full min-w-0 space-y-6 bg-background p-4 text-foreground transition-colors sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Managers
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage your team members and their permissions.
                        </p>
                    </div>

                    {can.create && (
                        <button
                            onClick={openCreateModal}
                            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
                        >
                            + Add Manager
                        </button>
                    )}
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">Total Managers</p>
                        <h2 className="mt-2 text-3xl font-bold text-card-foreground">
                            {managers.length}
                        </h2>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">Active Managers</p>
                        <h2 className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                            {managers.length}
                        </h2>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">Available Permissions</p>
                        <h2 className="mt-2 text-3xl font-bold text-primary">
                            {availablePermissions.length}
                        </h2>
                    </div>
                </div>

                {/* Manager Table */}
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5">
                        <div>
                            <h2 className="font-semibold text-card-foreground">
                                All Managers
                            </h2>
                            <p className="mt-1 text-xs text-muted-foreground">
                                View and manage registered managers.
                            </p>
                        </div>

                        <input
                            type="search"
                            placeholder="Search managers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`${inputClass} w-full sm:w-64`}
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/70 text-xs uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-4">Manager</th>
                                    <th className="px-6 py-4">Permissions</th>
                                    <th className="px-6 py-4">Account</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-border">
                                {filteredManagers.map((manager) => (
                                    <tr
                                        key={manager.id}
                                        className="transition-colors hover:bg-muted/40"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                                                    {manager.name.charAt(0).toUpperCase()}
                                                </div>

                                                <div>
                                                    <p className="font-medium text-card-foreground">
                                                        {manager.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {manager.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                                {manager.permissions.length} Permissions
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                                Active
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-3">
                                                {can.edit && (
                                                    <button
                                                        onClick={() => openEditModal(manager)}
                                                        className="font-medium text-primary hover:opacity-75"
                                                    >
                                                        Edit
                                                    </button>
                                                )}

                                                {can.delete && (
                                                    <button
                                                        onClick={() => deleteManager(manager)}
                                                        className="font-medium text-red-600 hover:text-red-500 dark:text-red-400"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredManagers.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16 text-center">
                                            <p className="font-medium text-card-foreground">
                                                No managers found
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Add a manager to get started.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-border px-6 py-4 text-xs text-muted-foreground">
                        Showing {filteredManagers.length} of {managers.length} managers
                    </div>
                </div>
            </div>

            {/* Create / Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
                    <div className="my-auto w-full max-w-2xl rounded-2xl border border-border bg-card text-card-foreground shadow-2xl">
                        <div className="flex items-center justify-between border-b border-border p-6">
                            <div>
                                <h2 className="text-xl font-bold text-card-foreground">
                                    {editingManager ? 'Edit Manager' : 'Create Manager'}
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Manage account details and permissions.
                                </p>
                            </div>

                            <button
                                onClick={closeModal}
                                className="text-2xl text-muted-foreground transition hover:text-foreground"
                                aria-label="Close modal"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={submitForm}>
                            <div className="max-h-[65vh] space-y-5 overflow-y-auto p-6">
                                {/* Name */}
                                <div>
                                    <label className={labelClass}>Full Name</label>
                                    <input
                                        type="text"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        placeholder="Enter manager name"
                                        className={inputClass}
                                    />

                                    {form.errors.name && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                            {form.errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className={labelClass}>Email Address</label>
                                    <input
                                        type="email"
                                        value={form.data.email}
                                        onChange={(e) => form.setData('email', e.target.value)}
                                        placeholder="manager@example.com"
                                        className={inputClass}
                                    />

                                    {form.errors.email && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                            {form.errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <label className={labelClass}>
                                        Password {editingManager && '(Optional)'}
                                    </label>
                                    <input
                                        type="password"
                                        value={form.data.password}
                                        onChange={(e) => form.setData('password', e.target.value)}
                                        placeholder={
                                            editingManager
                                                ? 'Leave blank to keep current password'
                                                : 'Enter password'
                                        }
                                        className={inputClass}
                                    />

                                    {form.errors.password && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                            {form.errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Permissions */}
                                <div>
                                    <div className="mb-3 flex items-center justify-between">
                                        <label className="text-sm font-semibold text-foreground">
                                            Assign Permissions
                                        </label>

                                        <span className="text-xs text-muted-foreground">
                                            {form.data.permissions.length} selected
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-background p-4 sm:grid-cols-2">
                                        {availablePermissions.map((permission) => (
                                            <label
                                                key={permission}
                                                className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition hover:bg-muted"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={form.data.permissions.includes(permission)}
                                                    onChange={() => togglePermission(permission)}
                                                    className="h-4 w-4 rounded border-input accent-primary"
                                                />

                                                <span className="text-sm text-foreground">
                                                    {permission.replaceAll('.', ' ')}
                                                </span>
                                            </label>
                                        ))}
                                    </div>

                                    {form.errors.permissions && (
                                        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                                            {form.errors.permissions}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-3 border-t border-border bg-muted/40 p-5">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {form.processing
                                        ? 'Saving...'
                                        : editingManager
                                            ? 'Update Manager'
                                            : 'Create Manager'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
