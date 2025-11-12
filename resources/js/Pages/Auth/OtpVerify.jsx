import { useEffect, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function OtpVerify({ email, message }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: email,
        code: '',
    });

    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setResendDisabled(false);
        }
    }, [countdown]);

    useEffect(() => {
        return () => {
            reset('code');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('otp.verify'));
    };

    const resend = () => {
        setResendDisabled(true);
        setCountdown(60);
        post(route('otp.resend'), {
            preserveScroll: true,
        });
    };

    return (
        <GuestLayout>
            <Head title="Verify Code" />

            <div className="mb-4 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Check Your Email</h2>
                <p className="mt-2 text-sm text-gray-600">
                    We've sent a 6-digit code to
                </p>
                <p className="mt-1 text-sm font-medium text-blue-600">{email}</p>
            </div>

            {message && (
                <div className="mb-4 text-sm font-medium text-green-600 text-center">
                    {message}
                </div>
            )}

            <form onSubmit={submit}>
                <input type="hidden" name="email" value={data.email} />

                <div>
                    <InputLabel htmlFor="code" value="Verification Code" />

                    <TextInput
                        id="code"
                        type="text"
                        name="code"
                        value={data.code}
                        className="mt-1 block w-full text-center text-2xl tracking-widest"
                        autoComplete="off"
                        isFocused={true}
                        onChange={(e) => setData('code', e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        maxLength="6"
                    />

                    <InputError message={errors.code} className="mt-2" />
                </div>

                <div className="mt-6">
                    <PrimaryButton className="w-full justify-center" disabled={processing || data.code.length !== 6}>
                        {processing ? 'Verifying...' : 'Verify & Login'}
                    </PrimaryButton>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Didn't receive the code?{' '}
                        <button
                            type="button"
                            onClick={resend}
                            disabled={resendDisabled || processing}
                            className="text-blue-600 hover:text-blue-500 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            {resendDisabled ? `Resend in ${countdown}s` : 'Resend'}
                        </button>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}


