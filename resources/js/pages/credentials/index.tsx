import { Head, router, useForm, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
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

    // Password generator settings
    const [generatorOpen, setGeneratorOpen] = useState(false);
    const [passwordLength, setPasswordLength] = useState(20);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [generatedPasswordVisible, setGeneratedPasswordVisible] = useState(false);

    const form = useForm({
        website_id: '',
        title: '',
        username: '',
        password: '',
        email: '',
        login_url: '',
        notes: '',
    });

    const { url } = usePage();

    useEffect(() => {
        const params = new URLSearchParams(url.split('?')[1] ?? '');

        if (params.get('create') === '1' && can.create) {
            setEditing(null);
            form.reset();
            form.clearErrors();
            setModalOpen(true);
        }
    }, [url, can.create]);

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

    function secureRandomInt(max: number): number {
        // Rejection sampling avoids modulo bias.
        const range = 0x100000000;
        const limit = range - (range % max);
        const randomValues = new Uint32Array(1);

        let value: number;

        do {
            window.crypto.getRandomValues(randomValues);
            value = randomValues[0];
        } while (value >= limit);

        return value % max;
    }

    function generatePassword() {
        const characterSets = [
            includeUppercase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '',
            includeLowercase ? 'abcdefghijklmnopqrstuvwxyz' : '',
            includeNumbers ? '0123456789' : '',
            includeSymbols ? '!@#$%^&*()_+-=[]{};:,.?' : '',
        ].filter((set) => set.length > 0);

        if (characterSets.length === 0) {
            alert('কমপক্ষে একটি character type নির্বাচন করো।');
            return;
        }

        if (passwordLength < characterSets.length) {
            alert(`নির্বাচিত character type অনুযায়ী password length কমপক্ষে ${characterSets.length} হতে হবে।`);
            return;
        }

        const allCharacters = characterSets.join('');
        const passwordCharacters = characterSets.map(
            (set) => set[secureRandomInt(set.length)]
        );

        while (passwordCharacters.length < passwordLength) {
            passwordCharacters.push(
                allCharacters[secureRandomInt(allCharacters.length)]
            );
        }

        // Secure Fisher-Yates shuffle.
        for (let i = passwordCharacters.length - 1; i > 0; i--) {
            const j = secureRandomInt(i + 1);
            [passwordCharacters[i], passwordCharacters[j]] = [
                passwordCharacters[j],
                passwordCharacters[i],
            ];
        }

        form.setData('password', passwordCharacters.join(''));
        setGeneratedPasswordVisible(false);
    }

    async function copyGeneratedPassword() {
        if (!form.data.password) {
            alert('প্রথমে একটি password generate করো।');
            return;
        }

        try {
            await navigator.clipboard.writeText(form.data.password);
            alert('Password copied successfully!');
        } catch {
            alert('Password copy করা যায়নি।');
        }
    }

    const selectedCharacterTypes = [
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
    ].filter(Boolean).length;

    const passwordStrength =
        !form.data.password ? null :
        form.data.password.length >= 16 && selectedCharacterTypes >= 3 ? 'Strong' :
        form.data.password.length >= 12 && selectedCharacterTypes >= 2 ? 'Good' :
        'Weak';

    const strengthWidth =
        passwordStrength === 'Strong' ? '100%' :
        passwordStrength === 'Good' ? '65%' : '30%';

    const strengthColor =
        passwordStrength === 'Strong' ? 'bg-emerald-500' :
        passwordStrength === 'Good' ? 'bg-amber-500' : 'bg-red-500';

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
                        <h1 className="text-2xl font-bold text-foreground">
                            Credentials
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
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

                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search credentials..."
                            className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                        />
                    </div>

                    <div className="mt-5 overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                                    <th className="px-3 py-3">Title</th>
                                    <th className="px-3 py-3">Website</th>
                                    <th className="px-3 py-3">Username</th>
                                    <th className="px-3 py-3">Password</th>
                                    <th className="px-3 py-3">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredCredentials.map((item) => (
                                    <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                                        <td className="px-3 py-4 font-medium text-foreground">
                                            {item.title}
                                            {item.email && (
                                                <p className="mt-1 text-xs text-gray-500">{item.email}</p>
                                            )}
                                        </td>

                                        <td className="px-3 py-4 text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Globe size={16} />
                                                {item.website_name}
                                            </div>
                                        </td>

                                        <td className="px-3 py-4 text-muted-foreground">
                                            {item.username || '—'}
                                        </td>

                                        <td className="px-3 py-4">
                                            {can.viewPassword ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="max-w-[150px] truncate font-mono text-foreground">
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
                    <div className="my-6 w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-foreground">
                                {editing ? 'Edit Credential' : 'Add Credential'}
                            </h2>
                            <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-800">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={submitForm} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">
                                    Website *
                                </label>
                                <select
                                    value={form.data.website_id}
                                    onChange={(e) => form.setData('website_id', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
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
                                    <label className="mb-1 block text-sm font-medium text-foreground">
                                        {field.label}
                                    </label>
                                    {field.name === 'password' ? (
                                        <>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <input
                                                        type={generatedPasswordVisible ? 'text' : 'password'}
                                                        value={form.data.password}
                                                        onChange={(e) => form.setData('password', e.target.value)}
                                                        placeholder={field.placeholder}
                                                        autoComplete="new-password"
                                                        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 pr-11 font-mono text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setGeneratedPasswordVisible((visible) => !visible)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                        title={generatedPasswordVisible ? 'Hide password' : 'Show password'}
                                                    >
                                                        {generatedPasswordVisible ? <EyeOff size={17} /> : <Eye size={17} />}
                                                    </button>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setGeneratorOpen((open) => !open)}
                                                    className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-primary/30 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10"
                                                >
                                                    <RefreshCw size={16} />
                                                    Generator
                                                </button>
                                            </div>

                                            {generatorOpen && (
                                                <div className="mt-3 space-y-4 rounded-xl border border-border bg-muted/30 p-4">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div>
                                                            <h3 className="text-sm font-semibold text-foreground">Password Generator</h3>
                                                            <p className="mt-1 text-xs text-muted-foreground">Create a strong, random password.</p>
                                                        </div>
                                                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                                                            {passwordLength} characters
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <div className="mb-2 flex items-center justify-between">
                                                            <label className="text-sm font-medium text-foreground">Password length</label>
                                                            <span className="text-sm font-semibold tabular-nums text-foreground">{passwordLength}</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min={8}
                                                            max={64}
                                                            value={passwordLength}
                                                            onChange={(e) => setPasswordLength(Number(e.target.value))}
                                                            className="w-full accent-primary"
                                                        />
                                                        <div className="flex justify-between text-xs text-muted-foreground">
                                                            <span>8</span>
                                                            <span>64</span>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        {[
                                                            { label: 'Uppercase (A–Z)', checked: includeUppercase, change: setIncludeUppercase },
                                                            { label: 'Lowercase (a–z)', checked: includeLowercase, change: setIncludeLowercase },
                                                            { label: 'Numbers (0–9)', checked: includeNumbers, change: setIncludeNumbers },
                                                            { label: 'Symbols (!@#)', checked: includeSymbols, change: setIncludeSymbols },
                                                        ].map((option) => (
                                                            <label key={option.label} className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={option.checked}
                                                                    onChange={(e) => option.change(e.target.checked)}
                                                                    className="h-4 w-4 rounded border-input accent-primary"
                                                                />
                                                                {option.label}
                                                            </label>
                                                        ))}
                                                    </div>

                                                    {form.data.password && passwordStrength && (
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between text-xs">
                                                                <span className="text-muted-foreground">Password strength</span>
                                                                <span className={
                                                                    passwordStrength === 'Strong' ? 'font-semibold text-emerald-500' :
                                                                    passwordStrength === 'Good' ? 'font-semibold text-amber-500' :
                                                                    'font-semibold text-red-500'
                                                                }>
                                                                    {passwordStrength}
                                                                </span>
                                                            </div>
                                                            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                                                <div
                                                                    className={`h-full rounded-full transition-all ${strengthColor}`}
                                                                    style={{ width: strengthWidth }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={generatePassword}
                                                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                                                        >
                                                            <RefreshCw size={15} />
                                                            Generate Password
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={copyGeneratedPassword}
                                                            disabled={!form.data.password}
                                                            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            <Copy size={15} />
                                                            Copy
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <input
                                            type="text"
                                            value={form.data[field.name as keyof typeof form.data]}
                                            onChange={(e) => form.setData(field.name as keyof typeof form.data, e.target.value)}
                                            placeholder={field.placeholder}
                                            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                                        />
                                    )}
                                    {form.errors[field.name as keyof typeof form.errors] && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {form.errors[field.name as keyof typeof form.errors]}
                                        </p>
                                    )}
                                </div>
                            ))}

                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">
                                    Notes
                                </label>
                                <textarea
                                    rows={3}
                                    value={form.data.notes}
                                    onChange={(e) => form.setData('notes', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                                />
                                {form.errors.notes && <p className="mt-1 text-xs text-red-500">{form.errors.notes}</p>}
                            </div>

                            <div className="flex justify-end gap-3 border-t border-border pt-4">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-muted"
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
