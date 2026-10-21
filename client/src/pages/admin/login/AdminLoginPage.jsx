import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { apiRequest } from '../../../lib/api';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Enter your email address.').email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
});

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function submitLogin(values) {
    setServerError('');

    try {
      await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      navigate('/admin', { replace: true });
    } catch (error) {
      setServerError(error.message);
    }
  }

  return (
    <main className="grid min-h-screen bg-ivory lg:grid-cols-[0.92fr_1.08fr]">
      <section className="relative hidden overflow-hidden bg-primary p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute top-0 right-0 h-full w-2/5 bg-champagne/[0.08]" aria-hidden="true" />
        <div className="absolute -right-40 -bottom-40 aspect-square w-[34rem] rounded-full border border-champagne/20" aria-hidden="true" />
        <div className="absolute -right-24 -bottom-24 aspect-square w-[24rem] rounded-full border border-champagne/10" aria-hidden="true" />

        <Link className="relative w-fit" to="/" aria-label="Grace Nyambura home">
          <span className="block font-display text-3xl font-semibold">Grace Nyambura</span>
          <span className="mt-2 block text-[0.65rem] font-bold uppercase tracking-[0.2em] text-champagne">
            Content administration
          </span>
        </Link>

        <div className="relative max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-champagne">A clear place to manage the work</p>
          <h2 className="mt-6 text-balance font-display text-xl leading-[1.12] md:text-2xl lg:text-3xl">
            Your content, client stories, enquiries, and website settings—in one thoughtful workspace.
          </h2>
          <p className="mt-7 max-w-lg leading-8 text-white/65">
            Sign in to manage the ideas and information that shape your online presence.
          </p>
        </div>

        <p className="relative text-sm text-white/45">Private access for authorized administrators.</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          <Link className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-primary lg:hidden" to="/">
            <ArrowLeft size={16} aria-hidden="true" />
            Return to website
          </Link>

          <div className="mt-10 lg:mt-0">
            <div className="grid h-12 w-12 place-items-center border border-champagne bg-white text-primary shadow-[0_10px_30px_rgba(27,34,56,0.08)]">
              <LockKeyhole size={20} strokeWidth={1.7} aria-hidden="true" />
            </div>
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.16em] text-emerald">Admin portal</p>
            <h1 className="mt-3 font-display text-xl leading-tight text-primary md:text-2xl lg:text-3xl">Welcome back</h1>
            <p className="mt-3 leading-7 text-muted">Enter your administrator details to continue.</p>
          </div>

          <form className="mt-10 grid gap-6" onSubmit={handleSubmit(submitLogin)} noValidate>
            <div>
              <label className="text-sm font-semibold text-primary" htmlFor="email">Email address</label>
              <div className="relative mt-2">
                <Mail className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" size={18} aria-hidden="true" />
                <input
                  className="min-h-13 w-full border border-border bg-white py-3 pr-4 pl-12 text-primary outline-none transition focus:border-emerald focus:ring-2 focus:ring-emerald/15"
                  id="email"
                  type="email"
                  autoComplete="username"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  placeholder="you@example.com"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-700" id="email-error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-primary" htmlFor="password">Password</label>
              <div className="relative mt-2">
                <LockKeyhole className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" size={18} aria-hidden="true" />
                <input
                  className="min-h-13 w-full border border-border bg-white py-3 pr-12 pl-12 text-primary outline-none transition focus:border-emerald focus:ring-2 focus:ring-emerald/15"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  placeholder="Enter your password"
                  {...register('password')}
                />
                <button
                  className="absolute top-1/2 right-3 grid h-9 w-9 -translate-y-1/2 place-items-center text-muted transition-colors hover:text-primary"
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-700" id="password-error">{errors.password.message}</p>}
            </div>

            {serverError && (
              <div className="border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800" role="alert">
                {serverError}
              </div>
            )}

            <button
              className="inline-flex min-h-13 items-center justify-center gap-2 bg-primary px-5 py-3 font-bold text-white transition hover:bg-[#29324f] disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && <LoaderCircle className="animate-spin" size={18} aria-hidden="true" />}
              {isSubmitting ? 'Signing in…' : 'Sign in securely'}
            </button>
          </form>

          <div className="mt-8 border-t border-border pt-6">
            <p className="text-sm leading-6 text-muted">
              Access is provisioned privately. If you cannot sign in, contact the website administrator.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
