import { api, ApiError, escapeHtml as e, formatDate } from '../lib/client';
import { statuses, annualQuantityLabel } from '../lib/rfq';
import type { RfqRecord, RfqEvent, UploadRecord } from '../server/types';
type Person = { user_id: string; display_name: string };
type Summary = {
  id: string;
  reference: string;
  status: string;
  company: string;
  contact: string;
  parts: number;
  updatedAt: string;
  ownerId: string | null;
};
type Notification = {
  id: string;
  kind: string;
  state: string;
  attempts: number;
  last_error: string | null;
};
const login = document.querySelector<HTMLFormElement>('#admin-login')!,
  workspace = document.querySelector<HTMLElement>('#admin-workspace')!,
  message = document.querySelector<HTMLElement>('#admin-message')!,
  detail = document.querySelector<HTMLElement>('#admin-detail')!;
const filter = document.querySelector<HTMLFormElement>('#admin-filter')!,
  previous = document.querySelector<HTMLButtonElement>('#previous-page')!,
  next = document.querySelector<HTMLButtonElement>('#next-page')!;
let people: Person[] = [],
  page = 1,
  total = 0,
  selected: string | null = null;
function report(error: unknown) {
  message.hidden = false;
  message.textContent =
    error instanceof Error ? error.message : 'The request could not be completed.';
  message.dataset.tone = 'error';
  if (error instanceof ApiError && [401, 403].includes(error.status)) {
    login.hidden = false;
    workspace.hidden = true;
    detail.replaceChildren();
    document.querySelector('#admin-rows')!.replaceChildren();
  }
}
async function loadSession() {
  try {
    const me = await api<{ id: string; name: string; people: Person[] }>('/api/admin/me/');
    people = me.people;
    document.querySelector('#staff-name')!.textContent = me.name;
    login.hidden = true;
    workspace.hidden = false;
    message.hidden = true;
    await loadList();
    const request = new URLSearchParams(location.search).get('request');
    if (request && /^[0-9a-f-]{36}$/.test(request)) await loadDetail(request, false);
  } catch (error) {
    login.hidden = false;
    if (error instanceof ApiError && error.status === 401) {
      message.textContent = 'Sign in with your company-provisioned staff account.';
    } else report(error);
  }
}
login.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = login.querySelector<HTMLButtonElement>('button')!;
  button.disabled = true;
  try {
    await api('/api/admin/login/', {
      method: 'POST',
      body: {
        email: (login.elements.namedItem('email') as HTMLInputElement).value.trim(),
        password: (login.elements.namedItem('password') as HTMLInputElement).value,
      },
    });
    login.reset();
    await loadSession();
  } catch (error) {
    report(error);
  } finally {
    button.disabled = false;
  }
});
document.querySelector('#staff-logout')!.addEventListener('click', async () => {
  try {
    await api('/api/admin/logout/', { method: 'POST', body: {} });
    login.hidden = false;
    workspace.hidden = true;
    detail.replaceChildren();
    document.querySelector('#admin-rows')!.replaceChildren();
    message.hidden = false;
    message.textContent = 'You are signed out.';
    delete message.dataset.tone;
    history.replaceState(null, '', '/admin/');
  } catch (error) {
    report(error);
  }
});
async function loadList() {
  const params = new URLSearchParams({
    page: String(page),
    status: (filter.elements.namedItem('status') as HTMLSelectElement).value,
    q: (filter.elements.namedItem('q') as HTMLInputElement).value,
  });
  const result = await api<{ records: Summary[]; total: number }>(`/api/admin/requests/?${params}`);
  total = result.total;
  document.querySelector('#admin-count')!.textContent =
    `${total} matching ${total === 1 ? 'enquiry' : 'enquiries'}`;
  document.querySelector('#admin-rows')!.innerHTML = result.records.length
    ? result.records
        .map(
          (r) =>
            `<tr><td><a href="?request=${e(r.id)}" data-request="${e(r.id)}">${e(r.reference)}</a><br /><strong>${e(r.company)}</strong><br />${e(r.contact)} · ${r.parts} part(s)</td><td><span class="status-badge">${e(r.status)}</span></td><td>${e(people.find((p) => p.user_id === r.ownerId)?.display_name || 'Unassigned')}</td><td>${e(formatDate(r.updatedAt))}</td></tr>`,
        )
        .join('')
    : '<tr><td colspan="4">No enquiries match these filters.</td></tr>';
  document.querySelector('#page-count')!.textContent =
    `Page ${page} of ${Math.max(1, Math.ceil(total / 20))}`;
  previous.disabled = page <= 1;
  next.disabled = page * 20 >= total;
  document.querySelectorAll<HTMLAnchorElement>('[data-request]').forEach((link) =>
    link.addEventListener('click', (event) => {
      event.preventDefault();
      void loadDetail(link.dataset.request!).catch(report);
    }),
  );
}
filter.addEventListener('submit', (event) => {
  event.preventDefault();
  page = 1;
  void loadList().catch(report);
});
previous.addEventListener('click', () => {
  page--;
  void loadList().catch(report);
});
next.addEventListener('click', () => {
  page++;
  void loadList().catch(report);
});
async function loadDetail(id: string, focus = true) {
  selected = id;
  const result = await api<{
    record: RfqRecord;
    files: UploadRecord[];
    events: RfqEvent[];
    notifications: Notification[];
  }>(`/api/admin/requests/${id}/`);
  if (selected !== id) return;
  const { record: r } = result,
    p = r.payload;
  const row = (name: string, value: unknown) =>
    `<dt>${e(name)}</dt><dd>${e(value || 'Not supplied')}</dd>`;
  const events = result.events
    .map(
      (event) =>
        `<li><time datetime="${e(event.created_at)}">${e(formatDate(event.created_at))} · ${e(people.find((p) => p.user_id === event.actor_id)?.display_name || 'Website')}</time><h3>${e(event.status)}</h3>${event.message ? `<p><strong>Customer update</strong><br />${e(event.message)}</p>` : ''}${event.internal_note ? `<div class="admin-private"><strong>Internal note</strong><br />${e(event.internal_note)}</div>` : ''}</li>`,
    )
    .join('');
  detail.innerHTML = `<div class="admin-topline"><div><p class="eyebrow">SELECTED ENQUIRY</p><h2>${e(r.reference)}</h2></div><button type="button" id="reload-detail" class="small-button">Reload</button></div><div class="admin-detail-layout"><div><h3>${e(p.company)}</h3><dl class="review-details">${row('Contact', p.contactName)}${row('Email', p.email)}${row('Phone', p.phone)}${row('Industry', p.industry)}${row('Delivery', p.deliveryLocation)}${row('Start', p.startDate)}${row('Frequency', p.frequency)}${row('Notes', p.notes)}</dl>${p.parts.map((part, i) => `<section class="review-part"><h3>${i + 1}. ${e(part.name)}</h3><dl class="review-details">${row('Revision', part.revision)}${row('Annual quantity', annualQuantityLabel(part.annualQuantity))}${row('Material', part.material)}${row('Thickness', part.thickness)}${row('Finish', part.finish)}</dl></section>`).join('')}<h3>Private drawings</h3><ul class="admin-attachments">${result.files.length ? result.files.map((f) => `<li><a href="/api/admin/requests/${e(id)}/file/?file=${e(f.id)}">${e(f.name)}</a> · ${(f.size / 1048576).toFixed(1)} MB</li>`).join('') : '<li>No drawings attached.</li>'}</ul><h3>Notifications</h3><ul class="notice-list">${result.notifications.map((n) => `<li>${e(n.kind.replaceAll('_', ' '))}: <strong>${e(n.state)}</strong> · ${n.attempts} attempt(s)${n.last_error ? `<br />${e(n.last_error)}` : ''}</li>`).join('')}</ul>${result.notifications.some((n) => ['pending', 'failed'].includes(n.state)) ? '<button type="button" class="small-button" id="retry-mail">Retry pending notifications</button>' : ''}</div><div><form id="update-enquiry"><div class="form-grid"><div class="field full"><label for="request-owner">Assigned owner</label><select id="request-owner" name="ownerId"><option value="">Unassigned</option>${people.map((person) => `<option value="${e(person.user_id)}" ${person.user_id === r.owner_id ? 'selected' : ''}>${e(person.display_name)}</option>`).join('')}</select></div><div class="field full"><label for="request-status">Enquiry status</label><select id="request-status" name="status">${statuses.map((s) => `<option ${r.status === s ? 'selected' : ''}>${e(s)}</option>`).join('')}</select></div><div class="field full"><label for="public-message">Message to the customer</label><textarea id="public-message" name="message" maxlength="2000" rows="4" aria-describedby="public-help"></textarea><small id="public-help">Visible on the status page and sent by email. Required when changing the status.</small></div><div class="field full"><label for="internal-note">Internal note</label><textarea id="internal-note" name="internalNote" maxlength="4000" rows="4"></textarea><small>Only authorised staff can see this. It is excluded from customer emails and status responses.</small></div></div><div class="form-actions"><button class="button button-dark" type="submit">Save update</button></div><p id="update-message" class="form-error" role="status"></p></form><h3 style="margin-top:35px">Update history</h3><ol class="timeline">${events}</ol></div></div>`;
  detail.hidden = false;
  history.replaceState(null, '', `/admin/?request=${encodeURIComponent(id)}`);
  if (focus) {
    detail.focus();
    detail.scrollIntoView({ block: 'start' });
  }
  document
    .querySelector('#reload-detail')!
    .addEventListener('click', () => void loadDetail(id, false).catch(report));
  document.querySelector('#retry-mail')?.addEventListener('click', async (event) => {
    const button = event.currentTarget as HTMLButtonElement;
    button.disabled = true;
    try {
      await api(`/api/admin/requests/${id}/retry/`, { method: 'POST', body: {} });
      await loadDetail(id, false);
    } catch (error) {
      report(error);
      button.disabled = false;
    }
  });
  document
    .querySelector<HTMLFormElement>('#update-enquiry')!
    .addEventListener('submit', async (event) => {
      event.preventDefault();
      const update = event.currentTarget as HTMLFormElement;
      const field = (name: string) => (update.elements.namedItem(name) as HTMLInputElement).value;
      const button = update.querySelector<HTMLButtonElement>('button')!;
      button.disabled = true;
      try {
        await api(`/api/admin/requests/${id}/`, {
          method: 'PATCH',
          body: {
            version: r.version,
            status: field('status'),
            ownerId: field('ownerId') || null,
            message: field('message'),
            internalNote: field('internalNote'),
          },
        });
        await loadDetail(id, false);
        await loadList();
        message.hidden = false;
        message.dataset.tone = 'success';
        message.textContent = `${r.reference} updated. Any customer notification is queued for delivery.`;
      } catch (error) {
        const box = document.querySelector('#update-message');
        if (box) box.textContent = error instanceof Error ? error.message : 'Update failed.';
        button.disabled = false;
      }
    });
}
void loadSession();
