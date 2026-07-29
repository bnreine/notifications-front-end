const authErrorMessages = {
  UserNotConfirmedException:
    'Your account is not verified yet. Check your email for a confirmation code.',
  NotAuthorizedException: 'Incorrect email or password.',
  UsernameExistsException: 'An account with this email already exists.',
  InvalidPasswordException:
    'Password does not meet requirements. Use at least 8 characters with uppercase, lowercase, numbers, and symbols.',
  SignInException:
    'Your sign-in session expired. Sign in with your temporary password again.',
  CodeMismatchException: 'Invalid verification code. Please try again.',
  ExpiredCodeException:
    'This verification code has expired. Request a new one and try again.',
  LimitExceededException: 'Too many attempts. Please wait and try again.',
};

export const getAuthErrorMessage = (error) => {
  if (!error) {
    return 'Something went wrong. Please try again.';
  }

  return (
    authErrorMessages[error.name] ||
    error.message ||
    'Something went wrong. Please try again.'
  );
};
