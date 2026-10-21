import { Check, LoaderCircle, MailX } from 'lucide-react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiRequest } from '../../lib/api';

export function UnsubscribePage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const token = searchParams.get('token') || '';

  async function unsubscribe() {
    setStatus('loading');
    setError('');
    try {
      await apiRequest('/public/subscribers/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
      setStatus('success');
    } catch (requestError) {
      setError(requestError.message);
      setStatus('error');
    }
  }

  return (
    <main className="bg-ivory px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <section className="mx-auto max-w-2xl border border-border bg-white p-7 text-center shadow-sm sm:p-12">
        {status === 'success' ? (
          <>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald text-white">
              <Check size={24} />
            </span>
            <h1 className="mt-6 font-display text-xl text-primary md:text-2xl lg:text-3xl">
              You have been unsubscribed.
            </h1>
            <p className="mx-auto mt-4 max-w-lg leading-7 text-muted">
              You will no longer receive mailing-list emails from me.
            </p>
          </>
        ) : (
          <>
            <span className="mx-auto grid h-14 w-14 place-items-center bg-ivory text-emerald">
              <MailX size={24} />
            </span>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.17em] text-emerald">
              Mailing preferences
            </p>
            <h1 className="mt-3 font-display text-xl text-primary md:text-2xl lg:text-3xl">
              Unsubscribe from the mailing list?
            </h1>
            <p className="mx-auto mt-4 max-w-lg leading-7 text-muted">
              Confirm below and I will stop sending insights and professional updates to this address.
            </p>
            {error && (
              <p className="mt-6 border-l-2 border-red-700 bg-red-50 p-3 text-left text-sm text-red-800" role="alert">
                {error}
              </p>
            )}
            <button
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 bg-primary px-6 font-bold text-white disabled:opacity-60"
              type="button"
              disabled={!token || status === 'loading'}
              onClick={unsubscribe}
            >
              {status === 'loading' && <LoaderCircle className="animate-spin" size={17} />}
              {status === 'loading' ? 'Unsubscribing…' : 'Confirm unsubscribe'}
            </button>
          </>
        )}
        <div className="mt-7">
          <Link className="text-sm font-bold text-emerald hover:text-primary" to="/">
            Return to the home page
          </Link>
        </div>
      </section>
    </main>
  );
}
