/**
 * Enquiry form handler for the requirement, sell and contact pages (works on both
 * Cloudflare and the static GitHub Pages build).
 *
 * On submit it validates required fields, sends the lead to the Google Apps Script
 * sheet, then redirects to /thank-you/.
 */
import { isValidEmail, isValidPhone, sendLead } from './lead';

const params = new URLSearchParams(window.location.search);

// Prefill ?property= on the contact page hidden field
const propertyField = document.getElementById('property-field') as HTMLInputElement | null;
if (propertyField && params.get('property')) propertyField.value = params.get('property')!;

// Prefill ?role= on the contact page (e.g. from partner banner)
const roleField = document.getElementById('user-role-field') as HTMLInputElement | null;
if (roleField && params.get('role')) roleField.value = params.get('role')!;

// Prefill ?need= on the requirement page
const needParam = params.get('need');
if (needParam) {
  const radio = document.querySelector<HTMLInputElement>(`[name="lookingFor"][value="${CSS.escape(needParam)}"]`);
  if (radio) radio.checked = true;
  const select = document.querySelector<HTMLSelectElement>('select[name="lookingFor"]');
  if (select && [...select.options].some((o) => o.value === needParam)) select.value = needParam;
}

const FIELDS = [
  'name', 'phone', 'email', 'userRole', 'lookingFor', 'preferredArea', 'budget', 'timeline',
  'callbackTime', 'propertyType', 'location', 'size', 'expectedPrice', 'property', 'message',
];

const FORM_TYPES: Record<string, string> = {
  'requirement-form': 'requirement',
  'sell-form': 'sell',
  'contact-form': 'contact',
};

function showError(form: HTMLFormElement, name: string, message: string) {
  const inputs = form.querySelectorAll<HTMLElement>(`[name="${name}"]`);
  const group = inputs[0]?.closest('.form-group');
  if (!group) return;
  const errorId = `${name}-error`;
  let errEl = group.querySelector<HTMLElement>('.field-error');
  if (!errEl) {
    errEl = document.createElement('p');
    errEl.className = 'field-error';
    errEl.id = errorId;
    errEl.setAttribute('role', 'alert');
    group.appendChild(errEl);
  }
  errEl.textContent = message;
  inputs.forEach((el) => {
    el.setAttribute('aria-invalid', 'true');
    const described = el.getAttribute('aria-describedby') ?? '';
    if (!described.split(' ').includes(errorId)) el.setAttribute('aria-describedby', `${described} ${errorId}`.trim());
  });
}

function clearErrors(form: HTMLFormElement) {
  form.querySelectorAll('.field-error').forEach((el) => el.remove());
  form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
}

function validate(form: HTMLFormElement, data: FormData): boolean {
  clearErrors(form);
  let ok = true;
  const fail = (name: string, msg: string) => { showError(form, name, msg); ok = false; };

  const required = new Set([...form.querySelectorAll<HTMLInputElement>('[aria-required="true"]')].map((el) => el.name));
  for (const name of required) {
    const value = data.get(name)?.toString().trim() ?? '';
    if (value) continue;
    if (name === 'consent') fail(name, 'Tick the box so we can contact you');
    else if (name === 'name') fail(name, 'Enter your name');
    else if (name === 'phone') fail(name, 'Enter your mobile number');
    else fail(name, 'This field is required');
  }

  const phone = data.get('phone')?.toString().trim();
  if (phone && !isValidPhone(phone)) fail('phone', 'Enter a 10-digit mobile number');
  const email = data.get('email')?.toString().trim();
  if (email && !isValidEmail(email)) fail('email', 'Enter a valid email address, or leave it empty');

  if (!ok) form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  return ok;
}

for (const [formId, formType] of Object.entries(FORM_TYPES)) {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  if (!form) continue;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (!validate(form, data)) return;

    // Honeypot: real visitors never fill the hidden "website" field.
    if (!data.get('website')) {
      const payload: Record<string, string> = { formType };
      for (const key of FIELDS) {
        const val = data.get(key)?.toString().trim();
        if (val) payload[key] = val;
      }
      sendLead(payload);
    }

    window.location.href = `${import.meta.env.BASE_URL}thank-you/`;
  });
}
