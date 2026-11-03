
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

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

    return (
        <>
            <Head title="Managers" />

            <div className="min-h-full w-full min-w-0 space-y-6 bg-gray-50 p-4 sm:p-6 lg:p-8">

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            Managers
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your team members and their permissions.
                        </p>
                    </div>

                    {can.create && (
                        <button
                            onClick={openCreateModal}
                            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-700"
                        >
                            + Add Manager
                        </button>
                    )}
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Total Managers</p>
                        <h2 className="mt-2 text-3xl font-bold text-gray-900">
                            {managers.length}
                        </h2>
                    </div>

                    <div className="rounded-xl border bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Active Managers</p>
                        <h2 className="mt-2 text-3xl font-bold text-green-600">
                            {managers.length}
                        </h2>
                    </div>

                    <div className="rounded-xl border bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Available Permissions</p>
                        <h2 className="mt-2 text-3xl font-bold text-blue-600">
                            {availablePermissions.length}
                        </h2>
                    </div>
                </div>

                {/* Manager Table */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                    <div className="flex flex-wrap items-center justify-between gap-4 border-b p-5">
                        <div>
                            <h2 className="font-semibold text-gray-900">
                                All Managers
                            </h2>
                            <p className="mt-1 text-xs text-gray-500">
                                View and manage registered managers.
                            </p>
                        </div>

                        <input
                            type="search"
                            placeholder="Search managers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white text-gray-900 placeholder:text-gray-400 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 sm:w-64"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-6 py-4">Manager</th>
                                    <th className="px-6 py-4">Permissions</th>
                                    <th className="px-6 py-4">Account</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {filteredManagers.map((manager) => (
                                    <tr key={manager.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                                                    {manager.name.charAt(0).toUpperCase()}
                                                </div>

                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {manager.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {manager.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                                {manager.permissions.length} Permissions
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                                                Active
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-3">
                                                {can.edit && (
                                                    <button
                                                        onClick={() => openEditModal(manager)}
                                                        className="font-medium text-blue-600 hover:text-blue-800"
                                                    >
                                                        Edit
                                                    </button>
                                                )}

                                                {can.delete && (
                                                    <button
                                                        onClick={() => deleteManager(manager)}
                                                        className="font-medium text-red-600 hover:text-red-800"
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
                                            <p className="font-medium text-gray-700">
                                                No managers found
                                            </p>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Add a manager to get started.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t px-6 py-4 text-xs text-gray-500">
                        Showing {filteredManagers.length} of {managers.length} managers
                    </div>
                </div>
            </div>

            {/* Create / Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
                    <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

                        <div className="flex items-center justify-between border-b p-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {editingManager ? 'Edit Manager' : 'Create Manager'}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Manage account details and permissions.
                                </p>
                            </div>

                            <button
                                onClick={closeModal}
                                className="text-2xl text-gray-400 hover:text-gray-900"
                                aria-label="Close modal"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={submitForm}>
                            <div className="max-h-[65vh] space-y-5 overflow-y-auto p-6">

                                {/* Name */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        placeholder="Enter manager name"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-black placeholder:text-gray-400 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                    />

                                    {form.errors.name && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {form.errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        value={form.data.email} 
                                        onChange={(e) => form.setData('email', e.target.value)}
                                        placeholder="manager@example.com"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-black placeholder:text-gray-400 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                    />

                                    {form.errors.email && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {form.errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Password {editingManager && '(Optional)'}
                                    </label>

                                    <input
                                        type="password"
                                        value={form.data.password}
                                        onChange={(e) => form.setData('password', e.target.value)}
                                        placeholder={editingManager ? 'Leave blank to keep current password' : 'Enter password'}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-black placeholder:text-gray-400 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                    />

                                    {form.errors.password && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {form.errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Permissions */}
                                <div>
                                    <div className="mb-3 flex items-center justify-between">
                                        <label className="text-sm font-semibold text-gray-900">
                                            Assign Permissions
                                        </label>

                                        <span className="text-xs text-gray-500">
                                            {form.data.permissions.length} selected
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 p-4 sm:grid-cols-2">
                                        {availablePermissions.map((permission) => (
                                            <label
                                                key={permission}
                                                className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition hover:bg-gray-50"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={form.data.permissions.includes(permission)}
                                                    onChange={() => togglePermission(permission)}
                                                    className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                                                />

                                                <span className="text-sm text-gray-700">
                                                    {permission.replaceAll('.', ' ')}
                                                </span>
                                            </label>
                                        ))}
                                    </div>

                                    {form.errors.permissions && (
                                        <p className="mt-2 text-xs text-red-600">
                                            {form.errors.permissions}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-3 border-t bg-gray-50 p-5">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
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
