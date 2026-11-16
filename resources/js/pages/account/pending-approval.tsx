import { Head, useForm } from '@inertiajs/react';
import { Clock, ShieldCheck } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function PendingApproval() {
    const { post, processing } = useForm();
    return (
        <>
            <Head title="Account Pending Approval" />

            <div className="flex min-h-screen items-center justify-center bg-background px-4">
                <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-lg">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
                        <Clock className="h-8 w-8 text-amber-500" />
                    </div>

                    <h1 className="text-2xl font-bold text-foreground">
                        Account Pending Approval
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        Your registration was successful. Your account is
                        currently waiting for administrator approval.
                    </p>

                    <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                        <ShieldCheck className="h-5 w-5" />
                        Your account is protected until approval.
                    </div>

                    <button
                        onClick={() => router.post('/logout')}
                        className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 text-primary-foreground"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}
