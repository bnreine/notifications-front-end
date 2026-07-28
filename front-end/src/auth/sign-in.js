import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import {
    Alert,
    Button,
    CircularProgress,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { signIn } from 'aws-amplify/auth';
import AuthBrand from './auth-brand.js';
// import AuthErrorAlert from './auth-error-alert.jsx';
// import { getAuthErrorMessage } from './auth-error-message.js';
import { useSessionContext } from '../session-context.js';
// import { usePostHog } from '@posthog/react';

const SignIn = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { accessToken, reloadSession, isSessionLoading } = useSessionContext();
    // const posthog = usePostHog();
    const [email, setEmail] = useState(location.state?.email || '');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage] = useState(location.state?.message || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (isSessionLoading) {
        return (
            <Stack sx={{ alignItems: 'center', py: 6 }}>
                <CircularProgress size={28} />
            </Stack>
        );
    }

    if (accessToken) {
        return <Navigate to="/configurations" replace />;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const result = await signIn({ username: email, password });

            // if (result.nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
            //     navigate('/confirm-sign-up', { state: { email } });
            //     return;
            // }

            if (
                result.nextStep?.signInStep ===
                'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED'
            ) {
                navigate('/new-password-required', {
                    state: {
                        email,
                        missingAttributes: result.nextStep.missingAttributes || [],
                        from: location.state?.from,
                    },
                });
                return;
            }

            if (!result.isSignedIn) {
                setError('Additional sign-in steps are required. Please try again.');
                return;
            }

            await reloadSession();
            // posthog.identify(email);
            // posthog.capture('sign_in');
            const from = location.state?.from || '/configurations';
            navigate(from, { replace: true });
        } catch (err) {
            // if (err.name === 'UserNotConfirmedException') {
            //     navigate('/confirm-sign-up', { state: { email } });
            //     return;
            // }

            // posthog.captureException(err);
            // setError(getAuthErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Stack
            component="form"
            spacing={3}
            onSubmit={handleSubmit}
            sx={{ width: '100%' }}
        >
            <AuthBrand
                title="Sign in"
                subtitle="Welcome back to Study Outline Generator"
            />

            {/*<AuthErrorAlert error={error} />*/}

            {successMessage && (
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                    {successMessage}
                </Alert>
            )}

            <Stack spacing={2}>
                <Stack spacing={0.5}>
                    <Typography variant="h6">Email</Typography>
                    <TextField
                        id="sign-in-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        fullWidth
                    />
                </Stack>

                <Stack spacing={0.5}>
                    <Typography variant="h6">Password</Typography>
                    <TextField
                        id="sign-in-password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        fullWidth
                    />
                </Stack>
            </Stack>

            <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                startIcon={
                    isSubmitting ? (
                        <CircularProgress size={16} color="inherit" />
                    ) : undefined
                }
            >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>

            {/* <Typography
        variant="h6"
        sx={{ textAlign: 'center', color: 'text.secondary' }}
      >
        Don&apos;t have an account?{' '}
        <Link component={RouterLink} to="/sign-up" underline="hover">
          Sign up
        </Link>
      </Typography> */}
        </Stack>
    );
};

export default SignIn;
