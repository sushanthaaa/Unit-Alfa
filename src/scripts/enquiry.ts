import { composeRfq, validateRfq, fieldNames, type Rfq } from '../lib/rfq';
const form = document.querySelector<HTMLFormElement>('#rfq-form')!;
const panel = document.querySelector<HTMLElement>('#draft-panel')!;
const error = document.querySelector<HTMLElement>('#form-error')!;
const text = document.querySelector<HTMLTextAreaElement>('#draft-text')!;
const status = document.querySelector<HTMLElement>('#draft-status')!;
let currentDraft: ReturnType<typeof composeRfq> | undefined;
const field = (name: string) =>
  form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
const selectedPart = new URLSearchParams(location.search).get('part');
if (selectedPart) field('part').value = selectedPart.slice(0, 250);
function prepare(values: Rfq) {
  currentDraft = composeRfq(values);
  text.value = `Subject: ${currentDraft.subject}\n\n${currentDraft.body}`;
  const mailto = document.querySelector<HTMLAnchorElement>('#email-draft')!;
  mailto.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(currentDraft.subject)}&body=${encodeURIComponent(currentDraft.body)}`;
  panel.hidden = false;
  error.hidden = true;
  status.textContent = '';
  panel.focus();
  return {
    status: 'draft_prepared',
    sent: false,
    recipient: form.dataset.email,
    subject: currentDraft.subject,
  };
}
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  try {
    prepare(validateRfq(Object.fromEntries(new FormData(form))));
  } catch (e) {
    error.textContent = e instanceof Error ? e.message : 'Please review your enquiry details.';
    error.hidden = false;
  }
});
form.addEventListener('input', () => {
  if (!panel.hidden) {
    panel.hidden = true;
    currentDraft = undefined;
    status.textContent = '';
  }
});
form.addEventListener('change', () => {
  if (!panel.hidden) {
    panel.hidden = true;
    currentDraft = undefined;
  }
});
document.querySelector('#copy-draft')?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(text.value);
    status.textContent =
      'Draft copied. Paste it into your email and attach the drawing before sending.';
  } catch {
    text.focus();
    text.select();
    status.textContent = 'Select and copy the draft text above. Clipboard access was unavailable.';
  }
});
document.querySelector('#download-draft')?.addEventListener('click', () => {
  if (!currentDraft) return;
  const url = URL.createObjectURL(new Blob([text.value], { type: 'text/plain;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'unit-alfa-enquiry.txt';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = 'Draft downloaded. Attach your drawings when you send your email.';
});
// Optional, page-scoped agent access uses the same validation and visible draft action.
type ModelContext = {
  registerTool: (
    tool: Record<string, unknown>,
    options: { signal: AbortSignal },
  ) => void | Promise<void>;
};
const context = (document as Document & { modelContext?: ModelContext }).modelContext;
if (context?.registerTool) {
  const lifecycle = new AbortController();
  const tool = {
    name: 'prepare_rfq_draft',
    title: 'Prepare a Unit Alfa enquiry draft',
    description:
      'Validate contact and component details, fill the visible enquiry form and prepare an unsent email draft. Does not send email or upload drawings.',
    inputSchema: {
      type: 'object',
      properties: Object.fromEntries(
        fieldNames.map((name) => [
          name,
          { type: 'string', maxLength: name === 'notes' ? 2000 : 250 },
        ]),
      ),
      required: ['name', 'company', 'email', 'part', 'quantity'],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false, untrustedContentHint: true },
    execute(input: unknown) {
      const values = validateRfq(input);
      for (const name of ['industry', 'drawing']) {
        const select = field(name) as HTMLSelectElement;
        if (
          values[name as keyof Rfq] &&
          !Array.from(select.options).some((o) => o.value === values[name as keyof Rfq])
        )
          throw new Error(`Choose an available ${name} option.`);
      }
      fieldNames.forEach((name) => (field(name).value = values[name]));
      return prepare(values);
    },
  };
  try {
    Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {});
  } catch {
    /* Form remains usable without agent access. */
  }
  window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
}
