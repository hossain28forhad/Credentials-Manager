
import { Form } from '@inertiajs/react';
import {
    Check,
    Copy,
    Eye,
    EyeOff,
    LockKeyhole,
    RefreshCw,
    ShieldAlert,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import AlertError from '@/components/alert-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useClipboard } from '@/hooks/use-clipboard';
import { regenerateRecoveryCodes } from '@/routes/two-factor';

type Props = {
    recoveryCodesList: string[];
    fetchRecoveryCodes: () => Promise<void>;
    errors: string[];
};

export default function TwoFactorRecoveryCodes({
    recoveryCodesList,
    fetchRecoveryCodes,
    errors,
}: Props) {
    const [codesAreVisible, setCodesAreVisible] = useState(false);
    const codesSectionRef = useRef<HTMLDivElement | null>(null);

    const [copiedText, copy] = useClipboard();

    const canRegenerateCodes =
        recoveryCodesList.length > 0 && codesAreVisible;

    const allCodes = recoveryCodesList.join('\n');
    const hasCopiedAll = copiedText === allCodes && allCodes.length > 0;

    const toggleCodesVisibility = useCallback(async () => {
        if (!codesAreVisible && !recoveryCodesList.length) {
            await fetchRecoveryCodes();
        }

        setCodesAreVisible(!codesAreVisible);

        if (!codesAreVisible) {
            setTimeout(() => {
                codesSectionRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            });
        }
    }, [codesAreVisible, recoveryCodesList.length, fetchRecoveryCodes]);

    useEffect(() => {
        if (!recoveryCodesList.length) {
            void fetchRecoveryCodes();
        }
    }, [recoveryCodesList.length, fetchRecoveryCodes]);

    const RecoveryCodeIcon = codesAreVisible ? EyeOff : Eye;

    return (
        <Card className="overflow-hidden rounded-2xl border-border shadow-sm">
            <CardHeader className="space-y-3 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                        <LockKeyhole className="size-5 text-primary" />
                    </div>

                    <div className="min-w-0 space-y-1">
                        <CardTitle className="text-base">
                            Recovery Codes
                        </CardTitle>

                        <CardDescription className="leading-6">
                            Keep these backup codes somewhere safe. You can
                            use them to access your account if you lose your
                            authenticator device.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 px-5 pb-5 sm:px-6 sm:pb-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={toggleCodesVisibility}
                        className="w-full sm:w-auto"
                        aria-expanded={codesAreVisible}
                        aria-controls="recovery-codes-section"
                    >
                        <RecoveryCodeIcon className="size-4" />
                        {codesAreVisible ? 'Hide codes' : 'View recovery codes'}
                    </Button>

                    {canRegenerateCodes && (
                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => copy(allCodes)}
                                className="flex-1 sm:flex-none"
                            >
                                {hasCopiedAll ? (
                                    <Check className="size-4" />
                                ) : (
                                    <Copy className="size-4" />
                                )}
                                {hasCopiedAll ? 'Copied' : 'Copy all'}
                            </Button>

                            <Form
                                {...regenerateRecoveryCodes.form()}
                                options={{ preserveScroll: true }}
                                onSuccess={fetchRecoveryCodes}
                            >
                                {({ processing }) => (
                                    <Button
                                        type="submit"
                                        variant="secondary"
                                        disabled={processing}
                                        className="flex-1 sm:flex-none"
                                    >
                                        <RefreshCw
                                            className={`size-4 ${processing ? 'animate-spin' : ''}`}
                                        />
                                        Regenerate
                                    </Button>
                                )}
                            </Form>
                        </div>
                    )}
                </div>

                <div
                    id="recovery-codes-section"
                    ref={codesSectionRef}
                    className={`grid transition-all duration-300 ${
                        codesAreVisible
                            ? 'grid-rows-[1fr] opacity-100'
                            : 'grid-rows-[0fr] opacity-0'
                    }`}
                    aria-hidden={!codesAreVisible}
                >
                    <div className="min-h-0 overflow-hidden">
                        <div className="space-y-4 pt-2">
                            {errors?.length ? (
                                <AlertError errors={errors} />
                            ) : (
                                <>
                                    <div className="rounded-xl border border-border bg-muted/30 p-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                Your backup codes
                                            </p>

                                            <span className="text-xs text-muted-foreground">
                                                {recoveryCodesList.length
                                                    ? `${recoveryCodesList.length} codes`
                                                    : 'Loading...'}
                                            </span>
                                        </div>

                                        {recoveryCodesList.length > 0 ? (
                                            <div
                                                className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                                                role="list"
                                                aria-label="Recovery codes"
                                            >
                                                {recoveryCodesList.map(
                                                    (code, index) => (
                                                        <div
                                                            key={`${index}-${code}`}
                                                            role="listitem"
                                                            className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5 font-mono text-sm text-foreground"
                                                        >
                                                            <span>{code}</span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {String(
                                                                    index + 1,
                                                                ).padStart(
                                                                    2,
                                                                    '0',
                                                                )}
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {Array.from(
                                                    { length: 8 },
                                                    (_, index) => (
                                                        <div
                                                            key={index}
                                                            className="h-9 animate-pulse rounded-lg bg-muted-foreground/10"
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                                        <ShieldAlert className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />

                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-foreground">
                                                Keep your codes secure
                                            </p>

                                            <p className="text-xs leading-5 text-muted-foreground">
                                                Each recovery code can only be
                                                used once. Store them in a
                                                secure password manager.
                                                Regenerating codes will
                                                invalidate your previous codes.
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
