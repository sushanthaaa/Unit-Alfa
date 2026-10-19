import {
  rfqSchema,
  annualQuantityLabel,
  fileTypes,
  MAX_FILES,
  MAX_FILE_BYTES,
  MAX_TOTAL_BYTES,
  type RfqInput,
} from '../lib/rfq';
import { api, ApiError, escapeHtml as e } from '../lib/client';
const form = document.querySelector<HTMLFormElement>('#rfq-form')!;
const steps = Array.from(form.querySelectorAll<HTMLFieldSetElement>('[data-step]'));
const back = form.querySelector<HTMLButtonElement>('#rfq-back')!,
  next = form.querySelector<HTMLButtonElement>('#rfq-next')!,
  submit = form.querySelector<HTMLButtonElement>('#rfq-submit')!;
const partsList = form.querySelector<HTMLElement>('#parts-list')!;
const errorBox = form.querySelector<HTMLElement>('#form-error')!,
  progress = form.querySelector<HTMLElement>('#submission-progress')!;
let step = 0,
  available = false,
  busy = false;
const submissionKey = crypto.randomUUID();
type Drawing = { file: File; type: string; id?: string; url?: string; uploaded?: boolean };
let drawings: Drawing[] = [];
function partEntries() {
  return Array.from(partsList.querySelectorAll<HTMLElement>('.part-entry'));
}
function renameParts() {
  partEntries().forEach((part, i) => {
    part.querySelector('[data-part-number]')!.textContent = String(i + 1);
    part.querySelectorAll<HTMLInputElement>('[data-field]').forEach((input) => {
      const field = input.dataset.field!;
      input.id = `part-${i}-${field}`;
      input.name = `parts.${i}.${field}`;
      part.querySelector(`[data-label="${field}"]`)!.setAttribute('for', input.id);
    });
    part.querySelector<HTMLButtonElement>('.remove-part')!.hidden = partEntries().length === 1;
  });
  document.querySelector<HTMLButtonElement>('#add-part')!.disabled = partEntries().length >= 10;
}
function addPart() {
  const template = document.querySelector<HTMLTemplateElement>('#part-template')!;
  partsList.append(template.content.cloneNode(true));
  renameParts();
  const part = partEntries().at(-1)!;
  part.querySelector('.remove-part')!.addEventListener('click', () => {
    part.remove();
    renameParts();
    partsList.querySelector<HTMLInputElement>('input')?.focus();
  });
  part
    .querySelector<HTMLInputElement>('[data-field="unknown"]')!
    .addEventListener('change', (event) => {
      const unknown = (event.target as HTMLInputElement).checked;
      const quantity = part.querySelector<HTMLInputElement>('[data-field="annualQuantity"]')!;
      quantity.disabled = unknown;
      quantity.required = !unknown;
    });
  return part;
}
const first = addPart();
const prefill = new URLSearchParams(location.search).get('part');
if (prefill)
  first.querySelector<HTMLInputElement>('[data-field="name"]')!.value = prefill.slice(0, 160);
document.querySelector('#add-part')!.addEventListener('click', () => {
  const part = addPart();
  part.querySelector<HTMLInputElement>('input')!.focus();
});
function value(name: string) {
  return (
    (
      form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    )?.value.trim() || ''
  );
}
function collect(): RfqInput {
  return {
    submissionKey,
    company: value('company'),
    contactName: value('contactName'),
    email: value('email'),
    phone: value('phone'),
    industry: value('industry'),
    deliveryLocation: value('deliveryLocation'),
    startDate: value('startDate'),
    frequency: value('frequency'),
    notes: value('notes'),
    website: value('website') as '',
    consent: (form.elements.namedItem('consent') as HTMLInputElement).checked as true,
    attachments: drawings.filter((d) => d.uploaded && d.id).map((d) => d.id!),
    parts: partEntries().map((part) => {
      const val = (key: string) =>
        part.querySelector<HTMLInputElement>(`[data-field="${key}"]`)!.value.trim();
      return {
        name: val('name'),
        revision: val('revision'),
        annualQuantity: part.querySelector<HTMLInputElement>('[data-field="unknown"]')!.checked
          ? null
          : Number(val('annualQuantity')),
        material: val('material'),
        thickness: val('thickness'),
        finish: val('finish'),
      };
    }),
  };
}
function showStep(index: number, focus = true) {
  step = index;
  steps.forEach((el, i) => (el.hidden = i !== index));
  form.querySelectorAll('.rfq-progress li').forEach((el, i) => {
    if (i === index) el.setAttribute('aria-current', 'step');
    else el.removeAttribute('aria-current');
  });
  back.hidden = index === 0;
  next.hidden = index === 3;
  submit.hidden = index !== 3;
  submit.disabled = !available || busy;
  if (index === 3) renderReview();
  if (focus) {
    steps[index].querySelector<HTMLElement>('legend')!.focus();
    steps[index].scrollIntoView({
      block: 'start',
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }
  errorBox.textContent = '';
}
function validStep() {
  for (const input of steps[step].querySelectorAll<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >('input,select,textarea')) {
    if (!input.checkValidity()) {
      input.reportValidity();
      return false;
    }
  }
  return true;
}
next.addEventListener('click', () => {
  if (validStep()) showStep(Math.min(3, step + 1));
});
back.addEventListener('click', () => showStep(Math.max(0, step - 1)));
showStep(0, false);
function renderReview() {
  const data = collect();
  const row = (label: string, text: unknown) =>
    `<dt>${e(label)}</dt><dd>${e(text || 'Not specified')}</dd>`;
  document.querySelector('#rfq-review')!.innerHTML =
    `<dl class="review-details">${row('Company', data.company)}${row('Contact', data.contactName)}${row('Email', data.email)}${row('Phone', data.phone)}${row('Industry', data.industry)}${row('Delivery', data.deliveryLocation)}${row('Intended start', data.startDate)}${row('Frequency', data.frequency)}</dl>${data.parts.map((p, i) => `<section class="review-part"><h3>${i + 1}. ${e(p.name)}</h3><dl class="review-details">${row('Annual quantity', annualQuantityLabel(p.annualQuantity))}${row('Revision', p.revision)}${row('Material', p.material)}${row('Thickness', p.thickness)}${row('Finish', p.finish)}</dl></section>`).join('')}<dl class="review-details">${row('Drawings', drawings.length ? drawings.map((d) => d.file.name).join('\n') : 'No files selected')}${row('Notes', data.notes)}</dl>`;
}
function renderFiles() {
  const list = form.querySelector('#upload-list')!;
  list.replaceChildren();
  drawings.forEach((drawing, i) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = `${drawing.file.name} · ${(drawing.file.size / 1048576).toFixed(1)} MB`;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Remove';
    remove.setAttribute('aria-label', `Remove ${drawing.file.name}`);
    remove.addEventListener('click', () => {
      drawings.splice(i, 1);
      renderFiles();
    });
    li.append(span, remove);
    list.append(li);
  });
}
form.querySelector<HTMLInputElement>('#drawings')!.addEventListener('change', (event) => {
  const input = event.target as HTMLInputElement;
  const feedback = document.querySelector('#upload-feedback')!;
  feedback.textContent = '';
  const pending = [...drawings];
  for (const file of Array.from(input.files || [])) {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const types = fileTypes[ext];
    if (!types) {
      feedback.textContent = 'Choose PDF, STEP, IGES, DXF, DWG, PNG or JPEG files.';
      break;
    }
    if (file.size === 0 || file.size > MAX_FILE_BYTES) {
      feedback.textContent = 'Each drawing must be non-empty and no larger than 20 MB.';
      break;
    }
    if (
      pending.length >= MAX_FILES ||
      pending.reduce((sum, d) => sum + d.file.size, 0) + file.size > MAX_TOTAL_BYTES
    ) {
      feedback.textContent = 'You can attach up to 6 files and 40 MB in total.';
      break;
    }
    if (pending.some((d) => d.file.name === file.name && d.file.size === file.size)) {
      feedback.textContent = 'That file is already selected.';
      continue;
    }
    pending.push({ file, type: types.includes(file.type) ? file.type : types[0] });
  }
  drawings = pending;
  input.value = '';
  renderFiles();
});
api<{ available: boolean }>('/api/rfq/availability/')
  .then((result) => {
    available = result.available;
    const message = document.querySelector('#service-message')!;
    message.innerHTML = available
      ? 'Your enquiry will be saved with a reference. Drawings stay private.'
      : 'Online submission is being configured. You can review the form, or <a href="mailto:gmo@unitalfa.co.in">email gmo@unitalfa.co.in</a> to discuss your requirement.';
    submit.disabled = !available;
  })
  .catch(() => {
    document.querySelector('#service-message')!.textContent =
      'Online enquiries are temporarily unavailable. Please email gmo@unitalfa.co.in or call +91 94806 16429.';
  });
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (busy) return;
  if (step < 3) {
    if (validStep()) showStep(step + 1);
    return;
  }
  if (!available || !validStep()) return;
  const parsed = rfqSchema.safeParse(collect());
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    errorBox.textContent = issue.message;
    const input = form.elements.namedItem(issue.path.join('.')) as HTMLInputElement | null;
    if (input) {
      const index = steps.findIndex((s) => s.contains(input));
      showStep(index);
      input.focus();
      errorBox.textContent = issue.message;
    }
    return;
  }
  busy = true;
  submit.disabled = true;
  back.disabled = true;
  errorBox.textContent = '';
  try {
    for (let i = 0; i < drawings.length; i++) {
      const drawing = drawings[i];
      if (drawing.uploaded) continue;
      progress.textContent = `Uploading drawing ${i + 1} of ${drawings.length}: ${drawing.file.name}`;
      if (!drawing.id) {
        const ticket = await api<{ id: string; url: string }>('/api/rfq/uploads/', {
          method: 'POST',
          body: {
            submissionKey,
            name: drawing.file.name,
            size: drawing.file.size,
            type: drawing.type,
          },
        });
        drawing.id = ticket.id;
        drawing.url = ticket.url;
      }
      const response = await fetch(drawing.url!, {
        method: 'PUT',
        headers: {
          'Content-Type': drawing.type,
          'x-upsert': 'false',
          'Cache-Control': 'max-age=0',
        },
        body: drawing.file,
        signal: AbortSignal.timeout(120000),
      });
      // A completed upload whose response was lost can safely be reused; the server verifies its metadata at submit.
      if (!response.ok) {
        const failure = await response.json().catch(() => null);
        const alreadyUploaded =
          response.status === 409 ||
          (response.status === 400 &&
            (String(failure?.statusCode) === '409' || failure?.error === 'Duplicate'));
        if (!alreadyUploaded)
          throw new Error(
            'A drawing upload could not complete. Your form is still here. Please retry.',
          );
      }
      drawing.uploaded = true;
    }
    progress.textContent = 'Saving your enquiry and preparing notifications…';
    const result = await api<{ reference: string; trackingToken: string }>('/api/rfq/', {
      method: 'POST',
      body: collect(),
    });
    form.hidden = true;
    document.querySelector<HTMLElement>('#service-message')!.hidden = true;
    const receipt = document.querySelector<HTMLElement>('#rfq-receipt')!;
    receipt.hidden = false;
    document.querySelector('#receipt-reference')!.textContent = result.reference;
    document.querySelector<HTMLAnchorElement>('#receipt-track')!.href =
      `/track-enquiry/#token=${encodeURIComponent(result.trackingToken)}`;
    document.querySelector('#copy-reference')!.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(result.reference);
        document.querySelector('#receipt-feedback')!.textContent = 'Reference copied.';
      } catch {
        document.querySelector('#receipt-feedback')!.textContent =
          'Select and copy the reference shown above.';
      }
    });
    receipt.focus();
    receipt.scrollIntoView({ block: 'start' });
  } catch (error) {
    errorBox.textContent =
      error instanceof Error
        ? error.message
        : 'The enquiry could not be completed. Please try again.';
    if (error instanceof ApiError && error.fields.length)
      errorBox.textContent += '\n' + error.fields.map((f) => `${f.path}: ${f.message}`).join('\n');
    errorBox.focus();
    progress.textContent = '';
  } finally {
    busy = false;
    submit.disabled = !available;
    back.disabled = false;
  }
});
window.addEventListener('beforeunload', (event) => {
  if (busy) {
    event.preventDefault();
  }
});
