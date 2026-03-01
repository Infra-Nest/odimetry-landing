import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import type { LoginRequest } from '../../types/auth';
import { useAuth } from '../../hooks/useAuth';

// ----- Email validation regex -----
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Login = () => {
  const { t: translate } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  // ----- Form fields -----
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberDevice, setRememberDevice] = useState(false);

  // ----- UI state -----
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ----- Validation -----
  const validate = () => {
    if (!email) return translate('login.errors.emailRequired', 'Please enter your email.');
    if (!EMAIL_REGEX.test(email)) return translate('login.errors.invalidEmail', 'Please enter a valid email address.');
    if (!password) return translate('login.errors.passwordRequired', 'Please enter your password.');
    return null;
  };

  // ----- Form submission -----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const payload: LoginRequest = {
        email,
        password,
        rememberDevice,
      };
      
      await login(payload);
      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || translate('login.errors.general', 'Login failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gray-950 text-white" aria-labelledby="login-heading">
      <Container>
        <div className="max-w-xl mx-auto bg-gray-900 border border-gray-800 rounded-lg p-6 sm:p-8">
          <div className="text-center mb-8">
            <h2 id="login-heading" className="text-2xl sm:text-3xl font-bold mb-2 text-gray-100">
              {translate('login.title')}
            </h2>
            <p className="text-sm text-gray-400">
              {translate('login.subtitle')}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" aria-label={translate('login.title')}>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">
                {translate('login.email')} *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={translate('login.emailPlaceholder', 'nombre@empresa.com')}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-300" htmlFor="password">
                  {translate('login.password')} *
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs text-blue-400 hover:text-blue-300 transition"
                  disabled={loading}
                >
                  {translate('login.forgotPassword')}
                </button>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                disabled={loading}
              />
            </div>

            {/* Remember Device Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                id="rememberDevice"
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="h-4 w-4 text-blue-500 bg-gray-800 border-gray-700 rounded focus:ring-blue-400 cursor-pointer"
                disabled={loading}
              />
              <label htmlFor="rememberDevice" className="text-sm text-gray-400 cursor-pointer">
                {translate('login.rememberDevice')}
              </label>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
                {loading ? translate('login.loading', 'Iniciando sesión...') : translate('login.submit')}
              </Button>
            </div>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center text-sm text-gray-400">
            {translate('login.noAccount')}{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-blue-400 hover:text-blue-300 font-medium transition"
              disabled={loading}
            >
              {translate('login.registerHere')}
            </button>
          </div>

        </div>
      </Container>
    </section>
  );
};
