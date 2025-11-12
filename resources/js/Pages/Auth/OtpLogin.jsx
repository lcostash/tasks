import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function OtpLogin({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
    });

    useEffect(() => {
        return () => {
            reset('email');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('otp.send'));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-4 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Enter your email address and we'll send you a one-time code
                </p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email Address" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="your@email.com"
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-6">
                    <PrimaryButton className="w-full justify-center" disabled={processing}>
                        {processing ? 'Sending...' : 'Send Login Code'}
                    </PrimaryButton>
                </div>

                <div className="mt-4 text-center text-sm text-gray-600">
                    <p>
                        Don't have an account yet? No worries! 
                        <br />
                        We'll create one for you automatically.
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}


