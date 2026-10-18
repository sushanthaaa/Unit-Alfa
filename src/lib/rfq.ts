import { z } from 'zod';

export const statuses = [
  'Received',
  'Under technical review',
  'Information required',
  'Quotation sent',
  'Closed',
] as const;
export type RfqStatus = (typeof statuses)[number];
export const MAX_FILES = 6;
export const MAX_FILE_BYTES = 20 * 1024 * 1024;
export const MAX_TOTAL_BYTES = 40 * 1024 * 1024;
export const fileTypes: Record<string, string[]> = {
  pdf: ['application/pdf'],
  png: ['image/png'],
  jpg: ['image/jpeg'],
  jpeg: ['image/jpeg'],
  dxf: ['application/dxf', 'image/vnd.dxf', 'application/octet-stream'],
  dwg: ['image/vnd.dwg', 'application/acad', 'application/octet-stream'],
  step: ['model/step', 'application/step', 'application/octet-stream'],
  stp: ['model/step', 'application/step', 'application/octet-stream'],
  iges: ['model/iges', 'application/iges', 'application/octet-stream'],
  igs: ['model/iges', 'application/iges', 'application/octet-stream'],
};
const line = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .refine((v) => !/[\x00-\x1f\x7f]/.test(v), 'Use a single line without control characters.');
const prose = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .refine(
      (v) => !/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(v),
      'Remove unsupported control characters.',
    );
export const partSchema = z.object({
  name: line(160).min(1, 'Enter the part name.'),
  revision: line(80).default(''),
  annualQuantity: z.number().int().min(1).max(1_000_000_000).nullable(),
  material: line(160).default(''),
  thickness: line(100).default(''),
  finish: line(200).default(''),
});
export const rfqSchema = z.object({
  submissionKey: z.uuid(),
  company: line(160).min(2, 'Enter your company name.'),
  contactName: line(100).min(2, 'Enter your name.'),
  email: z
    .email()
    .max(254)
    .transform((v) => v.toLowerCase()),
  phone: line(40).refine((v) => !v || /^[+()\d .-]{7,40}$/.test(v), 'Enter a valid phone number.'),
  industry: line(120),
  deliveryLocation: line(200),
  startDate: line(100),
  frequency: line(120),
  parts: z.array(partSchema).min(1).max(10),
  notes: prose(4000),
  attachments: z
    .array(z.uuid())
    .max(MAX_FILES)
    .refine((v) => new Set(v).size === v.length, 'Duplicate attachment.'),
  consent: z.literal(true),
  website: z.literal('').default(''),
});
export type RfqInput = z.infer<typeof rfqSchema>;
export type PartInput = z.infer<typeof partSchema>;
export const uploadSchema = z
  .object({
    submissionKey: z.uuid(),
    name: line(180).min(1),
    size: z.number().int().min(1).max(MAX_FILE_BYTES),
    type: line(100),
  })
  .superRefine((v, ctx) => {
    const ext = v.name.split('.').pop()?.toLowerCase() || '';
    if (!fileTypes[ext] || !fileTypes[ext].includes(v.type))
      ctx.addIssue({
        code: 'custom',
        message: 'Use PDF, STEP, IGES, DXF, DWG, PNG or JPEG files.',
        path: ['name'],
      });
    if (/[\\/]/.test(v.name))
      ctx.addIssue({
        code: 'custom',
        message: 'Use a filename without directory separators.',
        path: ['name'],
      });
  });
export const updateSchema = z.object({
  version: z.number().int().nonnegative(),
  status: z.enum(statuses),
  message: prose(2000),
  internalNote: prose(4000),
  ownerId: z.uuid().nullable(),
});
export type UpdateInput = z.infer<typeof updateSchema>;
export function annualQuantityLabel(q: number | null) {
  return q === null ? 'Not yet known' : `${q.toLocaleString('en-IN')} pieces / year`;
}
