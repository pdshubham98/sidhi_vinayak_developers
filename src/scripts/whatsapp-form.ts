/**
 * Static deployment form handler (GitHub Pages).
 *
 * On submit:
 * 1. POSTs lead data to Google Apps Script (fire-and-forget, no-cors)
 * 2. Opens WhatsApp with all fields pre-filled
 * 3. Redirects to /thank-you/
 *
 * On the full Cloudflare deployment this script is replaced by enhance-form.ts
 * which uses Astro Actions for server-side delivery.
 */

const WA_NUMBER = '917869246638';
const SCRIPT_URL = import.meta.env.PUBLIC_APPS_SCRIPT_URL as string | undefined;

// Prefill ?property= on the contact page hidden field
const propertyField = document.getElementById('property-field') as HTMLInputElement | null;
if (propertyField) {
  const param = new URLSearchParams(window.location.search).get('property');
  if (param) propertyField.value = decodeURIComponent(param);
}

// Prefill ?need= on the requirement page
const needParam = new URLSearchParams(window.location.search).get('need');
if (needParam) {
  const radio = document.querySelector<HTMLInputElement>(`[name="lookingFor"][value="${needParam}"]`);
  if (radio) radio.checked = true;
  const select = document.querySelector<HTMLSelectElement>('[name="lookingFor"]');
  if (select) select.value = needParam;
}

const FIELD_LABELS: Record<string, string> = {
  name: 'Name',
  phone: 'Mobile',
  email: 'Email',
  userRole: 'I am a',
  lookingFor: 'Looking for',
  preferredArea: 'Preferred area',
  budget: 'Budget',
  timeline: 'Timeline',
  callbackTime: 'Best time to call',
  propertyType: 'Property type',
  location: 'Property location',
  size: 'Size',
  expectedPrice: 'Expected price',
  property: 'Re: property',
  message: 'Message',
};

const FORM_TYPES: Record<string, string> = {
  'requirement-form': 'requirement',
  'sell-form': 'sell',
  'contact-form': 'contact',
};

const FORM_TITLES: Record<string, string> = {
  'requirement-form': 'Site visit request',
  'sell-form': 'Property listing enquiry',
  'contact-form': 'General enquiry',
};

(['requirement-form', 'sell-form', 'contact-form'] as const).forEach((formId) => {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(form);

    // Consent must be checked
    if (!data.get('consent')) {
      const consentEl = form.querySelector<HTMLElement>('[name="consent"]');
      const group = consentEl?.closest('.form-group');
      let errEl = group?.querySelector<HTMLElement>('.field-error');
      if (!errEl && group) {
        errEl = document.createElement('p');
        errEl.className = 'field-error';
        errEl.setAttribute('role', 'alert');
        group.appendChild(errEl);
      }
      if (errEl) errEl.textContent = 'Tick the box so we can contact you';
      consentEl?.focus();
      return;
    }

    // Build JSON payload for Apps Script
    const payload: Record<string, string> = {
      formType: FORM_TYPES[formId] ?? formId,
    };
    for (const key of Object.keys(FIELD_LABELS)) {
      const val = data.get(key)?.toString().trim();
      if (val) payload[key] = val;
    }

    // POST to Apps Script — fire and forget (no-cors = can't read response, but data arrives)
    if (SCRIPT_URL) {
      fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }

    // Build WhatsApp message
    const title = FORM_TITLES[formId] ?? 'Enquiry';
    const lines: string[] = [`*${title}*`, `_via sidhivinayakdevelopers_`, ''];

    for (const [key, label] of Object.entries(FIELD_LABELS)) {
      const val = data.get(key)?.toString().trim();
      if (val) lines.push(`${label}: ${val}`);
    }

    window.open(
      `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`,
      '_blank',
    );

    // Redirect to thank-you after WhatsApp opens
    setTimeout(() => {
      window.location.href = `${import.meta.env.BASE_URL}thank-you/`;
    }, 400);
  });
});
