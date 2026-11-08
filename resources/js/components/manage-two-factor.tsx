
import { Form } from '@inertiajs/react';
import {
    CheckCircle2,
    LockKeyhole,
    ShieldCheck,
    ShieldOff,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Heading from '@/components/heading';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { disable, enable } from '@/routes/two-factor';

export type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

export default function ManageTwoFactor(props: Props) {
    const requiresConfirmation = props.requiresConfirmation ?? false;
    const twoFactorEnabled = props.twoFactorEnabled ?? false;

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        clearTwoFactorAuthData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();

    const [showSetupModal, setShowSetupModal] = useState(false);
    const prevTwoFactorEnabled = useRef(twoFactorEnabled);

    useEffect(() => {
        if (prevTwoFactorEnabled.current && !twoFactorEnabled) {
            clearTwoFactorAuthData();
        }

        prevTwoFactorEnabled.current = twoFactorEnabled;
    }, [twoFactorEnabled, clearTwoFactorAuthData]);

    if (!(props.canManageTwoFactor ?? false)) {
        return null;
    }

    // if (false) {
    //     return null;
    // }

    console.log('2FA COMPONENT RENDERED', {
        canManageTwoFactor: props.canManageTwoFactor,
        requiresConfirmation: props.requiresConfirmation,
        twoFactorEnabled: props.twoFactorEnabled,
    });

    return (
        <div className="space-y-6">
            <Heading
                variant="small"
                title="Two-factor authentication"
                description="Add an extra layer of security to protect your account."
            />

            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                            <ShieldCheck className="size-6 text-primary" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-semibold text-foreground">
                                    Authenticator protection
                                </h3>

                                {twoFactorEnabled ? (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle2 className="size-3.5" />
                                        Enabled
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                                        <ShieldOff className="size-3.5" />
                                        Disabled
                                    </span>
                                )}
                            </div>

                            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                                {twoFactorEnabled
                                    ? 'Your account is protected with an additional authentication step. You will need a verification code from your authenticator app when signing in.'
                                    : 'Protect your account with an additional verification code from an authenticator app such as Google Authenticator or Microsoft Authenticator.'}
                            </p>
                        </div>
                    </div>

                    <div className="shrink-0">
                        {twoFactorEnabled ? (
                            <Form {...disable.form()}>
                                {({ processing }) => (
                                    <Button
                                        type="submit"
                                        variant="destructive"
                                        disabled={processing}
                                        className="w-full sm:w-auto"
                                    >
                                        <LockKeyhole className="size-4" />
                                        Disable 2FA
                                    </Button>
                                )}
                            </Form>
                        ) : (
                            <div>
                                {hasSetupData ? (
                                    <Button
                                        onClick={() =>
                                            setShowSetupModal(true)
                                        }
                                        className="w-full sm:w-auto"
                                    >
                                        <ShieldCheck className="size-4" />
                                        Continue setup
                                    </Button>
                                ) : (
                                    <Form
                                        {...enable.form()}
                                        onSuccess={() =>
                                            setShowSetupModal(true)
                                        }
                                    >
                                        {({ processing }) => (
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full sm:w-auto"
                                            >
                                                <ShieldCheck className="size-4" />
                                                Enable 2FA
                                            </Button>
                                        )}
                                    </Form>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-border bg-muted/30 px-5 py-4 sm:px-6">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-primary" />
                            Authenticator app support
                        </div>

                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-primary" />
                            Secure login verification
                        </div>

                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-primary" />
                            Backup recovery codes
                        </div>
                    </div>
                </div>
            </div>

            {twoFactorEnabled && (
                <TwoFactorRecoveryCodes
                    recoveryCodesList={recoveryCodesList}
                    fetchRecoveryCodes={fetchRecoveryCodes}
                    errors={errors}
                />
            )}

            <TwoFactorSetupModal
                isOpen={showSetupModal}
                onClose={() => setShowSetupModal(false)}
                requiresConfirmation={requiresConfirmation}
                twoFactorEnabled={twoFactorEnabled}
                qrCodeSvg={qrCodeSvg}
                manualSetupKey={manualSetupKey}
                clearSetupData={clearSetupData}
                fetchSetupData={fetchSetupData}
                errors={errors}
            />
        </div>
    );
}
