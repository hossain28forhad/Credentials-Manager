
import { Head, router, useForm, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    Globe,
    Search,
    Plus,
    Pencil,
    Trash2,
    ExternalLink,
    X,
} from 'lucide-react';

type Website = {
    id: number;
    name: string;
    dfid: string;
    url: string;
    category: string | null;
    description: string | null;
    created_by: string;
};

type Props = {
    websites: Website[];
    can: {
        create: boolean;
        edit: boolean;
        delete: boolean;
    };
};

type WebsiteForm = {
    name: string;
    url: string;
    category: string;
    description: string;
    dfid: string;
};

export default function WebsiteIndex({ websites, can }: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);
    const [search, setSearch] = useState('');

    const form = useForm<WebsiteForm>({
        name: '',
        url: '',
        dfid: '',
        category: '',
        description: '',
    });

    const { url } = usePage();

    useEffect(() => {
        const params = new URLSearchParams(url.split('?')[1] ?? '');

        if (params.get('create') === '1' && can.create) {
            setEditingWebsite(null);
            form.reset();
            form.clearErrors();
            setModalOpen(true);
        }
    }, [url, can.create]);

    const filteredWebsites = websites.filter((website) =>
        `${website.name} ${website.url} ${website.category ?? ''} ${website.dfid}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const openCreateModal = () => {
        setEditingWebsite(null);
        form.reset();
        form.clearErrors();
        setModalOpen(true);
    };

    const openEditModal = (website: Website) => {
        setEditingWebsite(website);
        form.clearErrors();

        form.setData({
            name: website.name,
            dfid: website.dfid,
            url: website.url,
            category: website.category ?? '',
            description: website.description ?? '',
        });

        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingWebsite(null);
        form.reset();
        form.clearErrors();
    };

    const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (editingWebsite) {
            form.put(`/websites/${editingWebsite.id}`, {
                onSuccess: closeModal,
            });
        } else {
            form.post('/websites', {
                onSuccess: closeModal,
            });
        }
    };

    const deleteWebsite = (website: Website) => {
        if (!window.confirm(`Delete ${website.name}?`)) {
            return;
        }

        router.delete(`/websites/${website.id}`);
    };

    const inputClass =
        'w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20';

    const labelClass = 'mb-2 block text-sm font-medium text-foreground';

    return (
        <>
            <Head title="Websites" />

            <div className="min-h-full w-full min-w-0 space-y-6 bg-background p-4 text-foreground transition-colors sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Websites
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage all your registered websites.
                        </p>
                    </div>

                    {can.create && (
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
                        >
                            <Plus size={17} />
                            Add Website
                        </button>
                    )}
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">Total Websites</p>
                            <Globe className="text-primary" size={22} />
                        </div>
                        <h2 className="mt-3 text-3xl font-bold text-card-foreground">
                            {websites.length}
                        </h2>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">Categories Used</p>
                        <h2 className="mt-3 text-3xl font-bold text-primary">
                            {new Set(
                                websites.map((website) => website.category).filter(Boolean)
                            ).size}
                        </h2>
                    </div>
                </div>

                {/* Website Table */}
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5">
                        <div>
                            <h2 className="font-semibold text-card-foreground">
                                All Websites
                            </h2>
                            <p className="mt-1 text-xs text-muted-foreground">
                                View and manage your websites.
                            </p>
                        </div>

                        <div className="relative w-full sm:w-72">
                            <Search
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search websites..."
                                className={`${inputClass} pl-10`}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px] text-left text-sm">
                            <thead className="bg-muted/70 text-xs uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-4">Website</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Created By</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-border">
                                {filteredWebsites.map((website) => (
                                    <tr
                                        key={website.id}
                                        className="transition-colors hover:bg-muted/40"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                    <Globe size={19} />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="font-medium text-card-foreground">
                                                        {website.name}
                                                    </p>

                                                    <p className="text-sm text-muted-foreground">
                                                        {website.dfid}
                                                    </p>

                                                    <a
                                                        href={website.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-1 inline-flex max-w-xs items-center gap-1 truncate text-xs text-primary hover:underline"
                                                    >
                                                        {website.url}
                                                        <ExternalLink size={12} />
                                                    </a>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                                {website.category || 'Uncategorized'}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-muted-foreground">
                                            {website.created_by}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-3">
                                                {can.edit && (
                                                    <button
                                                        onClick={() => openEditModal(website)}
                                                        className="text-primary transition hover:opacity-70"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={17} />
                                                    </button>
                                                )}

                                                {can.delete && (
                                                    <button
                                                        onClick={() => deleteWebsite(website)}
                                                        className="text-red-600 transition hover:text-red-500 dark:text-red-400"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={17} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredWebsites.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16 text-center">
                                            <Globe className="mx-auto text-muted-foreground/50" size={35} />
                                            <p className="mt-3 font-medium text-card-foreground">
                                                No websites found
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Add a website to get started.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-border px-6 py-4 text-xs text-muted-foreground">
                        Showing {filteredWebsites.length} of {websites.length} websites
                    </div>
                </div>
            </div>

            {/* Create / Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
                    <div className="my-auto w-full max-w-xl rounded-2xl border border-border bg-card text-card-foreground shadow-2xl">
                        <div className="flex items-center justify-between border-b border-border p-6">
                            <div>
                                <h2 className="text-xl font-bold text-card-foreground">
                                    {editingWebsite ? 'Edit Website' : 'Add Website'}
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Enter your website information.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                aria-label="Close modal"
                                className="text-muted-foreground transition hover:text-foreground"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        <form onSubmit={submitForm}>
                            <div className="space-y-5 p-6">
                                <div>
                                    <label className={labelClass}>
                                        Website Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        placeholder="Example: Google"
                                        className={inputClass}
                                    />
                                    {form.errors.name && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                            {form.errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Website URL *
                                    </label>
                                    <input
                                        type="url"
                                        required
                                        value={form.data.url}
                                        onChange={(e) => form.setData('url', e.target.value)}
                                        placeholder="https://example.com"
                                        className={inputClass}
                                    />
                                    {form.errors.url && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                            {form.errors.url}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className={labelClass}>DFID *</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.data.dfid}
                                        onChange={(e) => form.setData('dfid', e.target.value)}
                                        placeholder="Enter unique DFID"
                                        className={inputClass}
                                    />
                                    {form.errors.dfid && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                            {form.errors.dfid}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className={labelClass}>Category</label>
                                    <input
                                        type="text"
                                        value={form.data.category}
                                        onChange={(e) => form.setData('category', e.target.value)}
                                        placeholder="Social Media, Business, Development..."
                                        className={inputClass}
                                    />
                                    {form.errors.category && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                            {form.errors.category}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className={labelClass}>Description</label>
                                    <textarea
                                        rows={3}
                                        value={form.data.description}
                                        onChange={(e) => form.setData('description', e.target.value)}
                                        placeholder="Write a short description..."
                                        className={`${inputClass} resize-none`}
                                    />
                                    {form.errors.description && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                            {form.errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>

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
                                    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
                                >
                                    {form.processing
                                        ? 'Saving...'
                                        : editingWebsite
                                            ? 'Update Website'
                                            : 'Save Website'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
