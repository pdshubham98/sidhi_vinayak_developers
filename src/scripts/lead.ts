/** Shared by every enquiry form: phone validation and delivery to the Google Apps Script sheet. */

// 10-digit Indian mobile, optionally prefixed with +91, 91 or 0; spaces and dashes ignored.
const PHONE_RE = /^(?:\+?91|0)?[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidPhone = (v: string) => PHONE_RE.test(v.replace(/[\s-]/g, ''));
export const isValidEmail = (v: string) => EMAIL_RE.test(v);

const SCRIPT_URL = import.meta.env.PUBLIC_APPS_SCRIPT_URL as string | undefined;

/** Fire-and-forget: Apps Script does not send CORS headers, so the response cannot be read. */
export function sendLead(payload: Record<string, string>): void {
  if (!SCRIPT_URL) return;
  fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    keepalive: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {});
}
