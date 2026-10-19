import { api, formatDate, escapeHtml as e } from '../lib/client';
const token = new URLSearchParams(location.hash.slice(1)).get('token');
const message = document.querySelector<HTMLElement>('#tracking-message')!,
  result = document.querySelector<HTMLElement>('#tracking-result')!,
  button = document.querySelector<HTMLButtonElement>('#refresh-status')!;
// Keep the token in the fragment: it is never part of an HTTP request URL, referrer or canonical.
async function load() {
  if (!token) return;
  button.disabled = true;
  message.hidden = false;
  message.textContent = 'Retrieving your enquiry…';
  try {
    const response = await api<{
      reference: string;
      status: string;
      createdAt: string;
      events: { status: string; message: string; created_at: string }[];
    }>('/api/rfq/status/', { method: 'POST', body: { token } });
    document.querySelector('#tracking-reference')!.textContent = response.reference;
    document.querySelector('#tracking-status')!.textContent = response.status;
    document.querySelector('#tracking-date')!.textContent =
      `Received ${formatDate(response.createdAt)}`;
    document.querySelector('#tracking-events')!.innerHTML = response.events
      .map(
        (event) =>
          `<li><time datetime="${e(event.created_at)}">${e(formatDate(event.created_at))}</time><h3>${e(event.status)}</h3><p>${e(event.message)}</p></li>`,
      )
      .join('');
    result.hidden = false;
    message.hidden = true;
  } catch (error) {
    result.hidden = true;
    message.textContent =
      error instanceof Error ? error.message : 'The status could not be retrieved.';
  } finally {
    button.disabled = false;
  }
}
button.addEventListener('click', load);
void load();
