export const fieldNames = [
  'name',
  'company',
  'email',
  'phone',
  'part',
  'quantity',
  'material',
  'industry',
  'drawing',
  'finish',
  'delivery',
  'notes',
] as const;
export type RfqField = (typeof fieldNames)[number];
export type Rfq = Record<RfqField, string>;
export function validateRfq(input: unknown): Rfq {
  if (!input || typeof input !== 'object' || Array.isArray(input))
    throw new Error('Please provide the enquiry fields.');
  const object = input as Record<string, unknown>;
  const result = Object.fromEntries(
    fieldNames.map((key) => {
      if (object[key] !== undefined && typeof object[key] !== 'string')
        throw new Error(`Please enter text for ${key}.`);
      const value = String(object[key] || '').trim();
      if (value.length > (key === 'notes' ? 2000 : 250))
        throw new Error(`Please shorten the ${key} field.`);
      return [key, value];
    }),
  ) as Rfq;
  for (const key of ['name', 'company', 'email', 'part', 'quantity'] as const)
    if (!result[key]) throw new Error(`Please complete ${key === 'part' ? 'the part name' : key}.`);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email))
    throw new Error('Please enter a valid email address.');
  return result;
}
export function composeRfq(r: Rfq) {
  const subject = `Component enquiry: ${r.part.replace(/[\r\n]+/g, ' ')}`;
  const body = `Hello Unit Alfa,\n\nPlease review the following component requirement.\n\nPart / assembly: ${r.part}\nQuantity / batch: ${r.quantity}\nMaterial / thickness: ${r.material || 'To be discussed'}\nIndustry: ${r.industry || 'To be discussed'}\nDrawing / sample: ${r.drawing || 'To be discussed'}\nFinish: ${r.finish || 'To be discussed'}\nDelivery location / target: ${r.delivery || 'To be discussed'}\n\nAdditional requirements:\n${r.notes || 'None specified'}\n\nContact: ${r.name}\nCompany: ${r.company}\nEmail: ${r.email}\nPhone: ${r.phone || 'Not supplied'}\n\nDrawing attachments: please attach the relevant drawing or sample photographs before sending.\n`;
  return { subject, body };
}
