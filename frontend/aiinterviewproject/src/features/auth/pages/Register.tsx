import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface RegisterProps {
  onSubmit?: (data: {
    fullName: string;
    email: string;
    password: string;
    acceptedTerms: boolean;
  }) => Promise<void>;
  redirectTo?: string;
}

interface RegisterFieldErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptedTerms?: string;
}

const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
const validateName = (value: string) => /^[A-Za-z ]{2,}$/.test(value);
const validatePassword = (value: string) =>
  value.length >= 8 &&
  /[A-Z]/.test(value) &&
  /[a-z]/.test(value) &&
  /[0-9]/.test(value) &&
  /[^A-Za-z0-9]/.test(value);

const getPasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score as 0 | 1 | 2 | 3 | 4;
};

const Register: React.FC<RegisterProps> = ({
  redirectTo = '/login',
}) => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<RegisterFieldErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {loading,handleRegister} = useAuth();

  const passwordStrength = getPasswordStrength(password);

  const validateFields = async () => {
    const nextErrors: RegisterFieldErrors = {};

    if (!fullName.trim()) {
      nextErrors.fullName = 'Full name is required';
    } else if (!validateName(fullName.trim())) {
      nextErrors.fullName = 'Name must be at least 2 characters and contain only letters and spaces';
    }

    if (!email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!validateEmail(email.trim())) {
      nextErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      nextErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      nextErrors.password = 'Password does not meet requirements';
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptedTerms) {
      nextErrors.acceptedTerms = 'You must accept the terms to continue';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleBlur = (field: keyof RegisterFieldErrors) => {
    if (field === 'fullName') {
      if (!fullName.trim()) {
        setErrors((prev) => ({ ...prev, fullName: 'Full name is required' }));
      } else if (!validateName(fullName.trim())) {
        setErrors((prev) => ({
          ...prev,
          fullName: 'Name must be at least 2 characters and contain only letters and spaces',
        }));
      }
    }

    if (field === 'email') {
      if (!email.trim()) {
        setErrors((prev) => ({ ...prev, email: 'Email is required' }));
      } else if (!validateEmail(email.trim())) {
        setErrors((prev) => ({ ...prev, email: 'Please enter a valid email' }));
      } else {
        setErrors((prev) => ({ ...prev, email: undefined }));
      }
    }

    if (field === 'password') {
      if (!password) {
        setErrors((prev) => ({ ...prev, password: 'Password is required' }));
      } else if (!validatePassword(password)) {
        setErrors((prev) => ({ ...prev, password: 'Password does not meet requirements' }));
      } else {
        setErrors((prev) => ({ ...prev, password: undefined }));
      }
    }

    if (field === 'confirmPassword') {
      if (!confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: 'Please confirm your password' }));
      } else if (confirmPassword !== password) {
        setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGlobalError(null);
    setErrors({});
    setIsSubmitting(true);
    const isValid = await validateFields();
    if (!isValid) {
      return;
    }
    try {
      await handleRegister({name: fullName, email, password});
      navigate(redirectTo);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setGlobalError(message);
    } finally {
      setIsSubmitting(false);
    }

    if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  };

  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthLabel = password ? strengthLabels[Math.max(0, Math.min(passwordStrength - 1, 3))] : '';

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 px-8 py-10">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Get started</p>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-2 text-sm text-gray-500">Sign up and start using the app today.</p>
        </div>

        {globalError && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-300 px-4 py-3 text-sm text-red-700" role="alert">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              onBlur={() => handleBlur('fullName')}
              placeholder="John Doe"
              autoComplete="name"
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.fullName ? 'border-red-500 ring-red-400' : 'border-gray-300'
              }`}
            />
            {errors.fullName && (
              <p id="fullName-error" className="text-xs text-red-500 mt-1">
                {errors.fullName}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.email ? 'border-red-500 ring-red-400' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-red-500 mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className={`w-full px-4 py-2.5 pr-12 rounded-lg border text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.password ? 'border-red-500 ring-red-400' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-xs text-red-500 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {password && (
            <div className="mb-4">
              <div className="mt-2 flex gap-1">
                <div className={`h-1 flex-1 rounded-full ${passwordStrength >= 1 ? 'bg-red-400' : 'bg-gray-200'}`} />
                <div className={`h-1 flex-1 rounded-full ${passwordStrength >= 2 ? 'bg-orange-400' : 'bg-gray-200'}`} />
                <div className={`h-1 flex-1 rounded-full ${passwordStrength >= 3 ? 'bg-yellow-400' : 'bg-gray-200'}`} />
                <div className={`h-1 flex-1 rounded-full ${passwordStrength >= 4 ? 'bg-green-500' : 'bg-gray-200'}`} />
              </div>
              <p className={`mt-1 text-xs ${
                passwordStrength === 1
                  ? 'text-red-500'
                  : passwordStrength === 2
                  ? 'text-orange-500'
                  : passwordStrength === 3
                  ? 'text-yellow-600'
                  : 'text-green-600'
              }`}> 
                {passwordStrength === 0 ? 'Enter a password to see strength' : `${strengthLabel} — ${
                  passwordStrength === 1
                    ? 'add numbers & symbols'
                    : passwordStrength === 2
                    ? 'add an uppercase letter'
                    : passwordStrength === 3
                    ? 'add a special character'
                    : 'strong password'
                }`}
              </p>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                placeholder="Confirm password"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                className={`w-full px-4 py-2.5 pr-12 rounded-lg border text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.confirmPassword ? 'border-red-500 ring-red-400' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="confirmPassword-error" className="text-xs text-red-500 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span>
                I agree to the{' '}
                <Link to="/terms" className="text-indigo-600 underline hover:text-indigo-800 font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-indigo-600 underline hover:text-indigo-800 font-medium">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.acceptedTerms && (
              <p className="text-xs text-red-500 mt-2">{errors.acceptedTerms}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isSubmitting
                ? 'bg-indigo-400 cursor-not-allowed opacity-70'
                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Creating account…
              </span>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;