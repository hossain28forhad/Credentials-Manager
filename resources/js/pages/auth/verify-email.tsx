
import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';

export default function VerifyEmail() {
    useEffect(() => {
        router.visit('/dashboard', { replace: true });
    }, []);

    return (
        <>
            <Head title="Redirecting..." />

            <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
                <p className="text-sm text-muted-foreground">
                    Redirecting...
                </p>
            </div>
        </>
    );
}
