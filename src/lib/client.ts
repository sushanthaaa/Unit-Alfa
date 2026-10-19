export function escapeHtml(value: unknown) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
}
export function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value),
  );
}
export class ApiError extends Error {
  status: number;
  fields: { path: string; message: string }[];
  constructor(message: string, status: number, fields: ApiError['fields'] = []) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}
export async function api<T = Record<string, unknown>>(
  url: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const response = await fetch(url, {
    method: options.method || 'GET',
    credentials: 'same-origin',
    headers: options.body !== undefined ? { 'Content-Type': 'application/json' } : {},
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
  });
  const result = await response
    .json()
    .catch(() => ({ error: 'The service did not return a valid response. Please try again.' }));
  if (!response.ok)
    throw new ApiError(
      result.error || 'The request could not be completed.',
      response.status,
      result.fields,
    );
  return result;
}
