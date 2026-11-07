
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Home, ShieldAlert } from 'lucide-react';

export default function Forbidden() {
    return (
        <>
            <Head title="403 - Access Denied" />

            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12 text-foreground">
                <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-destructive/5 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

                <div className="relative w-full max-w-lg text-center">
                    <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-destructive/20 bg-destructive/10">
                        <ShieldAlert className="h-10 w-10 text-destructive" />
                    </div>

                    <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-destructive">
                        Access Denied
                    </p>

                    <h1 className="text-8xl font-black tracking-tight text-foreground sm:text-9xl">
                        403
                    </h1>

                    <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
                        You don't have permission!
                    </h2>

                    <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
                        Sorry, you are not authorized to access this page.
                        Please contact your administrator if you believe
                        this is a mistake.
                    </p>

                    <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold transition hover:bg-muted"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Go Back
                        </button>

                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                        >
                            <Home className="h-4 w-4" />
                            Go Home
                        </Link>
                    </div>

                    <p className="mt-12 text-xs text-muted-foreground">
                        Credential Manager &copy; {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </>
    );
}
