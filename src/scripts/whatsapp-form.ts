/**
 * GitHub Pages / static deployment: form submission opens WhatsApp with all
 * fields pre-filled as a message. The owner receives the enquiry on their phone.
 *
 * On the full Cloudflare deployment this script is replaced by enhance-form.ts
 * which uses Astro Actions for server-side delivery and email notification.
 */

const WA_NUMBER = '917869246638';

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
  lookingFor: 'Looking for',
  preferredArea: 'Preferred area',
  budget: 'Budget',
  timeline: 'Timeline',
  propertyType: 'Property type',
  location: 'Property location',
  size: 'Size',
  expectedPrice: 'Expected price',
  property: 'Re: property',
  message: 'Message',
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

    const title = FORM_TITLES[formId] ?? 'Enquiry';
    const lines: string[] = [
      `*${title}*`,
      `_via sidhivinayakdevelopers.com_`,
      '',
    ];

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
