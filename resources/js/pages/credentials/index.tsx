import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    Eye, EyeOff, Plus, Search, Pencil, Trash2, X, Globe, Copy,
    RefreshCw,
} from 'lucide-react';

type Website = {
    id: number;
    name: string;
};

type Credential = {
    id: number;
    website_id: number;
    website_name: string | null;
    title: string;
    username: string | null;
    email: string | null;
    login_url: string | null;
    notes: string | null;
    created_by: string | null;
};

type Props = {
    credentials: Credential[];
    websites: Website[];
    can: {
        create: boolean;
        edit: boolean;
        delete: boolean;
        viewPassword: boolean;
    };
};

export default function CredentialsIndex({ credentials, websites, can }: Props) {
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Credential | null>(null);
    const [visiblePasswords, setVisiblePasswords] = useState<Record<number, string>>({});
    const [loadingPassword, setLoadingPassword] = useState<number | null>(null);

    const form = useForm({
        website_id: '',
        title: '',
        username: '',
        password: '',
        email: '',
        login_url: '',
        notes: '',
    });

    const filteredCredentials = credentials.filter((item) =>
        [
            item.title,
            item.website_name,
            item.username,
            item.email,
        ].some((value) =>
            value?.toLowerCase().includes(search.toLowerCase())
        )
    );

    function openCreateModal() {
        setEditing(null);
        form.reset();
        setModalOpen(true);
    }

    function openEditModal(item: Credential) {
        setEditing(item);
        form.setData({
            website_id: String(item.website_id),
            title: item.title,
            username: item.username ?? '',
            password: '',
            email: item.email ?? '',
            login_url: item.login_url ?? '',
            notes: item.notes ?? '',
        });
        form.clearErrors();
        setModalOpen(true);
    }

    function submitForm(e: React.FormEvent) {
        e.preventDefault();

        if (editing) {
            form.put(`/credentials/${editing.id}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    form.reset();
                },
            });
        } else {
            form.post('/credentials', {
                onSuccess: () => {
                    setModalOpen(false);
                    form.reset();
                },
            });
        }
    }

    async function togglePassword(id: number) {
        if (visiblePasswords[id] !== undefined) {
            setVisiblePasswords((current) => {
                const updated = { ...current };
                delete updated[id];
                return updated;
            });
            return;
        }

        setLoadingPassword(id);

        try {
            const response = await fetch(`/credentials/${id}/password`, {
                headers: { Accept: 'application/json' },
                credentials: 'same-origin',
            });

            if (!response.ok) {
                throw new Error('Unable to retrieve password.');
            }

            const data = await response.json();

            setVisiblePasswords((current) => ({
                ...current,
                [id]: data.password,
            }));
        } catch {
            alert('Password দেখানো যাচ্ছে না। Permission পরীক্ষা করো।');
        } finally {
            setLoadingPassword(null);
        }
    }

    async function copyPassword(id: number) {
        let password = visiblePasswords[id];

        if (password === undefined) {
            alert('প্রথমে Password দেখাও।');
            return;
        }

        try {
            await navigator.clipboard.writeText(password);
            alert('Password copied successfully!');
        } catch {
            alert('Password copy করা যায়নি।');
        }
    }

    function generatePassword() {
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';

        const randomValues = new Uint32Array(20);
        window.crypto.getRandomValues(randomValues);

        const password = Array.from(randomValues)
            .map((value) => chars[value % chars.length])
            .join('');

        form.setData('password', password);
    }

    function deleteCredential(id: number) {
        if (confirm('এই credential delete করতে চাও?')) {
            router.delete(`/credentials/${id}`);
        }
    }

    return (
        <>
            <Head title="Credentials" />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Credentials
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your website login credentials securely.
                        </p>
                    </div>

                    {can.create && (
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            <Plus size={18} /> Add Credential
                        </button>
                    )}
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search credentials..."
                            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                    </div>

                    <div className="mt-5 overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left text-sm">
                            <thead>
                                <tr className="border-b text-xs uppercase text-gray-500 dark:border-gray-700">
                                    <th className="px-3 py-3">Title</th>
                                    <th className="px-3 py-3">Website</th>
                                    <th className="px-3 py-3">Username</th>
                                    <th className="px-3 py-3">Password</th>
                                    <th className="px-3 py-3">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredCredentials.map((item) => (
                                    <tr key={item.id} className="border-b last:border-0 dark:border-gray-800">
                                        <td className="px-3 py-4 font-medium text-gray-900 dark:text-white">
                                            {item.title}
                                            {item.email && (
                                                <p className="mt-1 text-xs text-gray-500">{item.email}</p>
                                            )}
                                        </td>

                                        <td className="px-3 py-4 text-gray-600 dark:text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <Globe size={16} />
                                                {item.website_name}
                                            </div>
                                        </td>

                                        <td className="px-3 py-4 text-gray-600 dark:text-gray-300">
                                            {item.username || '—'}
                                        </td>

                                        <td className="px-3 py-4">
                                            {can.viewPassword ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="max-w-[150px] truncate font-mono text-gray-600 dark:text-gray-300">
                                                        {visiblePasswords[item.id] ?? '••••••••'}

                                                    </span>
                                                    {visiblePasswords[item.id] !== undefined && (
                                                        <button
                                                            onClick={() => copyPassword(item.id)}
                                                            className="text-indigo-500 hover:text-indigo-700"
                                                            title="Copy password"
                                                        >
                                                            <Copy size={16} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => togglePassword(item.id)}
                                                        disabled={loadingPassword === item.id}
                                                        className="text-gray-500 hover:text-indigo-600"
                                                        title="Show or hide password"
                                                    >
                                                        {visiblePasswords[item.id] !== undefined
                                                            ? <EyeOff size={17} />
                                                            : <Eye size={17} />}
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">No access</span>
                                            )}
                                        </td>

                                        <td className="px-3 py-4">
                                            <div className="flex items-center gap-3">
                                                {can.edit && (
                                                    <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-800">
                                                        <Pencil size={17} />
                                                    </button>
                                                )}
                                                {can.delete && (
                                                    <button onClick={() => deleteCredential(item.id)} className="text-red-600 hover:text-red-800">
                                                        <Trash2 size={17} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredCredentials.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-3 py-10 text-center text-gray-500">
                                            No credentials found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
                    <div className="my-6 w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {editing ? 'Edit Credential' : 'Add Credential'}
                            </h2>
                            <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-800">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={submitForm} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Website *
                                </label>
                                <select
                                    value={form.data.website_id}
                                    onChange={(e) => form.setData('website_id', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                >
                                    <option value="">Select Website</option>
                                    {websites.map((website) => (
                                        <option key={website.id} value={website.id}>
                                            {website.name}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.website_id && <p className="mt-1 text-xs text-red-500">{form.errors.website_id}</p>}
                            </div>

                            {[
                                { name: 'title', label: 'Title *', placeholder: 'e.g. Admin Login' },
                                { name: 'username', label: 'Username', placeholder: 'Enter username' },
                                { name: 'email', label: 'Email', placeholder: 'Enter email' },
                                { name: 'password', label: editing ? 'New Password (leave blank to keep current)' : 'Password *', placeholder: 'Enter password' },
                                { name: 'login_url', label: 'Login URL', placeholder: 'https://example.com/login' },
                            ].map((field) => (
                                <div key={field.name}>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {field.label}
                                    </label>
                                    <input
                                        type={field.name === 'password' ? 'password' : 'text'}
                                        value={form.data[field.name as keyof typeof form.data]}
                                        onChange={(e) => form.setData(field.name as keyof typeof form.data, e.target.value)}
                                        placeholder={field.placeholder}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    />
                                    {field.name === 'password' && (
                                        <button
                                            type="button"
                                            onClick={generatePassword}
                                            className="mt-2 inline-flex items-center gap-2 rounded-lg border border-indigo-200 px-3 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800 dark:hover:bg-indigo-950"
                                        >
                                            <RefreshCw size={14} />
                                            Generate Strong Password
                                        </button>
                                    )}
                                    {form.errors[field.name as keyof typeof form.errors] && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {form.errors[field.name as keyof typeof form.errors]}
                                        </p>
                                    )}
                                </div>
                            ))}

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Notes
                                </label>
                                <textarea
                                    rows={3}
                                    value={form.data.notes}
                                    onChange={(e) => form.setData('notes', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                />
                                {form.errors.notes && <p className="mt-1 text-xs text-red-500">{form.errors.notes}</p>}
                            </div>

                            <div className="flex justify-end gap-3 border-t pt-4 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="rounded-lg border px-4 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {form.processing ? 'Saving...' : 'Save Credential'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
