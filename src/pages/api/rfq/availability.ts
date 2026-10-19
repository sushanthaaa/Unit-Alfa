import { endpoint, json } from '../../../server/http.ts';
import { serviceReady } from '../../../server/config.ts';
export const prerender = false;
export const GET = endpoint(async () => json({ available: serviceReady() }));
