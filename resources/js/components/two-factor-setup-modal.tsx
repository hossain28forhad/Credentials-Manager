
import { Form } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import {
    Check,
    Copy,
    KeyRound,
    ScanLine,
    ShieldCheck,
} from 'lucide-react';
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import AlertError from '@/components/alert-error';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Spinner } from '@/components/ui/spinner';
import { useClipboard } from '@/hooks/use-clipboard';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { confirm } from '@/routes/two-factor';

function GridScanIcon() {
    return (
        <div className="flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
            <ScanLine className="size-7 text-primary" />
        </div>
    );
}

function TwoFactorSetupStep({
    qrCodeSvg,
    manualSetupKey,
    buttonText,
    onNextStep,
    errors,
}: {
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    buttonText: string;
    onNextStep: () => void;
    errors: string[];
}) {
    const [copiedText, copy] = useClipboard();
    const IconComponent = copiedText === manualSetupKey ? Check : Copy;

    return (
        <div className="w-full space-y-6">
            {errors?.length ? (
                <AlertError errors={errors} />
            ) : (
                <>
                    <div className="rounded-2xl border border-border bg-muted/30 p-5">
                        <div className="mb-4 flex items-center justify-center gap-2 text-sm font-medium text-foreground">
                            <ScanLine className="size-4 text-primary" />
                            Scan with your authenticator app
                        </div>

                        <div className="mx-auto flex aspect-square w-full max-w-56 items-center justify-center rounded-xl border border-border bg-white p-4 shadow-sm">
                            {qrCodeSvg ? (
                                <div
                                    className="aspect-square w-full [&_svg]:size-full"
                                    dangerouslySetInnerHTML={{
                                        __html: qrCodeSvg,
                                    }}
                                />
                            ) : (
                                <Spinner />
                            )}
                        </div>

                        <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
                            Open Google Authenticator, Microsoft
                            Authenticator, or another TOTP app and scan this
                            QR code.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <KeyRound className="size-4 text-primary" />
                            Set up manually
                        </div>

                        <div className="flex overflow-hidden rounded-xl border border-border bg-background">
                            {manualSetupKey ? (
                                <>
                                    <input
                                        type="text"
                                        readOnly
                                        value={manualSetupKey}
                                        aria-label="Manual setup key"
                                        className="min-w-0 flex-1 bg-transparent px-3 py-3 font-mono text-sm tracking-wider text-foreground outline-none"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => copy(manualSetupKey)}
                                        aria-label="Copy setup key"
                                        className="flex items-center justify-center border-l border-border px-4 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                    >
                                        <IconComponent className="size-4" />
                                    </button>
                                </>
                            ) : (
                                <div className="flex w-full justify-center p-3">
                                    <Spinner />
                                </div>
                            )}
                        </div>

                        <p className="text-xs leading-5 text-muted-foreground">
                            If you cannot scan the QR code, enter this setup
                            key manually in your authenticator app.
                        </p>
                    </div>

                    <Button className="w-full" onClick={onNextStep}>
                        {buttonText}
                    </Button>
                </>
            )}
        </div>
    );
}

function TwoFactorVerificationStep({
    onClose,
    onBack,
}: {
    onClose: () => void;
    onBack: () => void;
}) {
    const [code, setCode] = useState('');
    const pinInputContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        pinInputContainerRef.current?.querySelector('input')?.focus();
    }, []);

    return (
        <Form
            {...confirm.form()}
            onSuccess={() => onClose()}
            resetOnError
            resetOnSuccess
        >
            {({ processing, errors }) => (
                <div className="w-full space-y-6">
                    <div className="rounded-2xl border border-border bg-muted/30 p-5">
                        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <ShieldCheck className="size-6" />
                        </div>

                        <p className="text-center text-sm leading-6 text-muted-foreground">
                            Enter the 6-digit verification code generated by
                            your authenticator app.
                        </p>
                    </div>

                    <div
                        ref={pinInputContainerRef}
                        className="w-full space-y-3"
                    >
                        <div className="flex justify-center py-2">
                            <InputOTP
                                id="otp"
                                name="code"
                                maxLength={OTP_MAX_LENGTH}
                                onChange={setCode}
                                disabled={processing}
                                pattern={REGEXP_ONLY_DIGITS}
                                autoFocus
                            >
                                <InputOTPGroup>
                                    {Array.from(
                                        { length: OTP_MAX_LENGTH },
                                        (_, index) => (
                                            <InputOTPSlot
                                                key={index}
                                                index={index}
                                            />
                                        ),
                                    )}
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        <InputError
                            message={errors?.confirmTwoFactorAuthentication}
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={onBack}
                            disabled={processing}
                        >
                            Back
                        </Button>

                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={
                                processing || code.length < OTP_MAX_LENGTH
                            }
                        >
                            {processing ? (
                                <>
                                    <Spinner />
                                    Verifying...
                                </>
                            ) : (
                                'Verify & Enable'
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </Form>
    );
}

type Props = {
    isOpen: boolean;
    onClose: () => void;
    requiresConfirmation: boolean;
    twoFactorEnabled: boolean;
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    clearSetupData: () => void;
    fetchSetupData: () => Promise<void>;
    errors: string[];
};

export default function TwoFactorSetupModal({
    isOpen,
    onClose,
    requiresConfirmation,
    twoFactorEnabled,
    qrCodeSvg,
    manualSetupKey,
    clearSetupData,
    fetchSetupData,
    errors,
}: Props) {
    const [showVerificationStep, setShowVerificationStep] = useState(false);

    const modalConfig = useMemo(() => {
        if (twoFactorEnabled) {
            return {
                title: 'Two-factor authentication enabled',
                description:
                    'Your account is now protected with two-factor authentication.',
                buttonText: 'Close',
            };
        }

        if (showVerificationStep) {
            return {
                title: 'Verify your authenticator',
                description:
                    'Confirm your setup by entering the code from your authenticator app.',
                buttonText: 'Verify',
            };
        }

        return {
            title: 'Set up two-factor authentication',
            description:
                'Follow the steps below to add an extra layer of security to your account.',
            buttonText: 'Continue to verification',
        };
    }, [twoFactorEnabled, showVerificationStep]);

    const resetModalState = useCallback(() => {
        if (twoFactorEnabled) {
            clearSetupData();
        }

        setShowVerificationStep(false);
    }, [clearSetupData, twoFactorEnabled]);

    const handleClose = useCallback(() => {
        resetModalState();
        onClose();
    }, [onClose, resetModalState]);

    const handleModalNextStep = useCallback(() => {
        if (requiresConfirmation) {
            setShowVerificationStep(true);
            return;
        }

        clearSetupData();
        handleClose();
    }, [requiresConfirmation, clearSetupData, handleClose]);

    const fetchSetupDataRef = useRef(fetchSetupData);

    useEffect(() => {
        fetchSetupDataRef.current = fetchSetupData;
    }, [fetchSetupData]);

    useEffect(() => {
        if (isOpen && !qrCodeSvg) {
            void fetchSetupDataRef.current();
        }
    }, [isOpen, qrCodeSvg]);

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => !open && handleClose()}
        >
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
                <DialogHeader className="flex flex-col items-center text-center">
                    <GridScanIcon />

                    <DialogTitle className="mt-2 text-xl">
                        {modalConfig.title}
                    </DialogTitle>

                    <DialogDescription className="max-w-sm leading-6">
                        {modalConfig.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="pt-2">
                    {showVerificationStep ? (
                        <TwoFactorVerificationStep
                            onClose={handleClose}
                            onBack={() => setShowVerificationStep(false)}
                        />
                    ) : (
                        <TwoFactorSetupStep
                            qrCodeSvg={qrCodeSvg}
                            manualSetupKey={manualSetupKey}
                            buttonText={modalConfig.buttonText}
                            onNextStep={handleModalNextStep}
                            errors={errors}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
