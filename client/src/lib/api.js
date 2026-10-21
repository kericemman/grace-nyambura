const API_URL = import.meta.env.VITE_API_URL ?? '/api/v1';

export class ApiError extends Error {
  constructor(error = {}, status) {
    super(error.message ?? 'Request failed');
    this.name = 'ApiError';
    this.code = error.code ?? 'REQUEST_FAILED';
    this.details = error.details ?? [];
    this.status = status;
  }
}

function readCookie(name) {
  return document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split('=')
    .slice(1)
    .join('=');
}

async function request(path, options = {}) {
  const method = options.method?.toUpperCase() ?? 'GET';
  const csrfToken = !['GET', 'HEAD', 'OPTIONS'].includes(method) ? readCookie('grace_csrf') : undefined;
  const hasFormData = options.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      ...(!hasFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => null);
  return { payload, response };
}

export async function apiRequest(path, options = {}) {
  let result = await request(path, options);

  if (result.response.status === 401 && !path.startsWith('/auth/')) {
    const refreshed = await request('/auth/refresh', { method: 'POST' });
    if (refreshed.response.ok) result = await request(path, options);
  }

  if (!result.response.ok) {
    throw new ApiError(result.payload?.error, result.response.status);
  }
  return result.payload;
}

