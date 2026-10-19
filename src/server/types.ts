import type { RfqInput, RfqStatus } from '../lib/rfq.ts';
export interface RfqRecord {
  id: string;
  reference: string;
  payload: Omit<RfqInput, 'submissionKey' | 'website' | 'attachments'>;
  status: RfqStatus;
  version: number;
  owner_id: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
}
export interface RfqEvent {
  id: string;
  rfq_id: string;
  status: RfqStatus;
  message: string;
  internal_note: string;
  actor_id: string | null;
  created_at: string;
}
export interface UploadRecord {
  id: string;
  rfq_id: string | null;
  owner_hash: string;
  path: string;
  name: string;
  size: number;
  mime_type: string;
  created_at: string;
}
export interface OutboxRecord {
  id: string;
  rfq_id: string;
  event_id: string | null;
  kind: 'staff_received' | 'customer_received' | 'customer_update';
  attempts: number;
  state: string;
  created_at: string;
}
