import { useState } from 'react';
import {
  Link as RouterLink,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router';
import {
  Button,
  CircularProgress,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { confirmSignIn } from 'aws-amplify/auth';
import AuthBrand from './auth-brand.js';
import AuthErrorAlert from './auth-error-alert.js';
import { getAuthErrorMessage } from './auth-error-message.js';
import { useSessionContext } from '../session-context.js';

const attributeLabels = {
  email: 'Email',
  name: 'Full name',
  given_name: 'First name',
  family_name: 'Last name',
  phone_number: 'Phone number',
};

const getAttributeLabel = (attribute) =>
  attributeLabels[attribute] ||
  attribute.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const NewPasswordRequired = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reloadSession } = useSessionContext();
  const email = location.state?.email;
  const missingAttributes = location.state?.missingAttributes || [];
  const from = location.state?.from || '/configurations';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [attributeValues, setAttributeValues] = useState(() =>
    missingAttributes.reduce((acc, attribute) => {
      acc[attribute] = attribute === 'email' && email ? email : '';
      return acc;
    }, {})
  );
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!email) {
    return <Navigate to="/sign-in" replace />;
  }

  const handleAttributeChange = (attribute) => (event) => {
    setAttributeValues((current) => ({
      ...current,
      [attribute]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    for (const attribute of missingAttributes) {
      if (!attributeValues[attribute]?.trim()) {
        setError(`${getAttributeLabel(attribute)} is required.`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const userAttributes = missingAttributes.length
        ? Object.fromEntries(
            missingAttributes.map((attribute) => [
              attribute,
              attributeValues[attribute].trim(),
            ])
          )
        : undefined;

      const result = await confirmSignIn({
        challengeResponse: newPassword,
        ...(userAttributes && {
          options: { userAttributes },
        }),
      });

      if (!result.isSignedIn) {
        setError('Unable to complete password reset. Please sign in again.');
        return;
      }

      await reloadSession();
      navigate(from, { replace: true });
    } catch (err) {
      if (err.name === 'SignInException') {
        navigate('/sign-in', {
          replace: true,
          state: {
            email,
            message:
              'Your password reset session expired. Sign in with your temporary password again.',
          },
        });
        return;
      }

      setError(getAuthErrorMessage(err));
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
      <Stack spacing={2} sx={{ p: 2 }}>
        <AuthBrand
          title="Set a new password"
          subtitle={`Choose a new password for ${email}`}
        />

        <AuthErrorAlert error={error} />

        {missingAttributes.map((attribute) => (
          <Stack key={attribute} spacing={0.5}>
            <Typography variant="subtitle">
              {getAttributeLabel(attribute)}
            </Typography>
            <TextField
              id={`new-password-attribute-${attribute}`}
              type={attribute === 'email' ? 'email' : 'text'}
              autoComplete={attribute === 'email' ? 'email' : attribute}
              value={attributeValues[attribute]}
              onChange={handleAttributeChange(attribute)}
              required
              size={'small'}
              fullWidth
            />
          </Stack>
        ))}

        <Stack spacing={0.5}>
          <Typography variant="subtitle">New password</Typography>
          <TextField
            id="new-password"
            type="password"
            autoComplete="new-password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            fullWidth
            size={'small'}
          />
        </Stack>

        <Stack spacing={0.5}>
          <Typography variant="subtitle">Confirm new password</Typography>
          <TextField
            id="confirm-new-password"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            fullWidth
            size={'small'}
          />
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
          {isSubmitting ? 'Updating password...' : 'Set password and continue'}
        </Button>

        <Typography
          variant="subtitle"
          sx={{ textAlign: 'center', color: 'text.secondary' }}
        >
          <Link
            component={RouterLink}
            to="/sign-in"
            state={{ email }}
            underline="hover"
          >
            Back to sign in
          </Link>
        </Typography>
      </Stack>
    </Stack>
  );
};

export default NewPasswordRequired;
