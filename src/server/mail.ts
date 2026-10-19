import { config, db, serviceReady } from './config.ts';
import { must } from './http.ts';
import { trackingToken } from './security.ts';
import type { OutboxRecord, RfqRecord, RfqEvent } from './types.ts';
import { annualQuantityLabel } from '../lib/rfq.ts';
export function emailText(
  record: RfqRecord,
  kind: OutboxRecord['kind'],
  event: RfqEvent | null,
  origin: string,
  token: string,
) {
  const p = record.payload;
  const statusUrl = `${origin}/track-enquiry/#token=${encodeURIComponent(token)}`;
  if (kind === 'staff_received')
    return `New manufacturing enquiry: ${record.reference}\n\nCompany: ${p.company}\nContact: ${p.contactName}\nEmail: ${p.email}\nPhone: ${p.phone || 'Not supplied'}\nIndustry: ${p.industry || 'Not supplied'}\nDelivery: ${p.deliveryLocation || 'Not supplied'}\nStart: ${p.startDate || 'Not supplied'}\nRelease frequency: ${p.frequency || 'To discuss'}\n\n${p.parts.map((part, i) => `${i + 1}. ${part.name}\nRevision: ${part.revision || 'Not supplied'}\nAnnual quantity: ${annualQuantityLabel(part.annualQuantity)}\nMaterial: ${part.material || 'To discuss'}\nThickness: ${part.thickness || 'To discuss'}\nFinish: ${part.finish || 'To discuss'}`).join('\n\n')}\n\nNotes:\n${p.notes || 'None'}\n\nOpen the staff dashboard to review drawings and update the status:\n${origin}/admin/?request=${record.id}\n\nReply to this email to contact the customer.`;
  if (kind === 'customer_received')
    return `Hello ${p.contactName},\n\nUnit Alfa has received your enquiry.\nReference: ${record.reference}\nParts: ${p.parts.map((part) => part.name).join(', ')}\n\nThe team will review your requirements. This acknowledgement is not a quotation or order acceptance.\n\nKeep this private link to view your enquiry status:\n${statusUrl}\n\nFor corrections or additional information, reply with your reference to gmo@unitalfa.co.in.\n\nJaisurya Govindan\nGeneral Manager | Unit Alfa\n+91 94806 16429`;
  return `Hello ${p.contactName},\n\nAn update on ${record.reference}:\n${event?.status || record.status}\n\n${event?.message || ''}\n\nView your enquiry status:\n${statusUrl}\n\nReply to gmo@unitalfa.co.in with your reference for any questions.\n\nUnit Alfa | +91 94806 16429`;
}
export async function dispatchMail(requestId: string | null = null) {
  if (!serviceReady()) return { sent: 0, pending: true };
  const client = db();
  const jobs = must(
    await client.rpc('rfq_claim_mail', { p_request_id: requestId, p_limit: 10 }),
  ) as OutboxRecord[];
  let sent = 0;
  for (const job of jobs) {
    try {
      const record = must(
        await client.from('rfq_requests').select('*').eq('id', job.rfq_id).single(),
      ) as RfqRecord;
      const event = job.event_id
        ? (must(
            await client.from('rfq_events').select('*').eq('id', job.event_id).single(),
          ) as RfqEvent)
        : null;
      const c = config();
      const staff = job.kind === 'staff_received';
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${c.resendKey}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': `rfq-${job.id}`,
        },
        body: JSON.stringify({
          from: c.from,
          to: [staff ? c.recipient : record.payload.email],
          reply_to: staff ? record.payload.email : c.recipient,
          subject: `[${record.reference}] ${staff ? 'New enquiry' : job.kind === 'customer_received' ? 'Enquiry received' : 'Enquiry update'}`,
          text: emailText(record, job.kind, event, c.origin, trackingToken(record.id)),
        }),
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) throw new Error(`provider_${response.status}`);
      const result = await response.json();
      must(
        await client
          .from('rfq_outbox')
          .update({
            state: 'sent',
            sent_at: new Date().toISOString(),
            provider_id: result.id,
            last_error: null,
            locked_until: null,
          })
          .eq('id', job.id)
          .eq('attempts', job.attempts),
      );
      sent++;
    } catch {
      // Persist a retry without recording provider payloads or customer data.
      await client
        .from('rfq_outbox')
        .update({
          state: job.attempts >= 8 ? 'failed' : 'pending',
          last_error: 'Delivery attempt failed. Check sender verification and provider logs.',
          locked_until: null,
          next_attempt_at: new Date(
            Date.now() + Math.min(3600, 60 * 2 ** job.attempts) * 1000,
          ).toISOString(),
        })
        .eq('id', job.id)
        .eq('attempts', job.attempts);
    }
  }
  return { sent, pending: sent < jobs.length };
}
