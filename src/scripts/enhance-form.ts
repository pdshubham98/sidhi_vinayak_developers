/**
 * Progressive enhancement for form pages.
 *
 * When JavaScript is available, the form submits via the Actions fetch API
 * instead of a full-page POST. Field errors are shown inline without a reload.
 * On success the browser is redirected to /thank-you.
 *
 * Without JavaScript, the form falls back to a normal POST with server-rendered errors.
 */

import { actions, isInputError } from 'astro:actions';

type ActionKey = 'requirement' | 'sell' | 'contact';

const formMap: Record<string, ActionKey> = {
  'requirement-form': 'requirement',
  'sell-form': 'sell',
  'contact-form': 'contact',
};

Object.entries(formMap).forEach(([formId, actionKey]) => {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous inline errors
    form.querySelectorAll('.field-error[role="alert"]').forEach(el => {
      (el as HTMLElement).textContent = '';
    });
    form.querySelectorAll('[aria-invalid]').forEach(el => {
      el.removeAttribute('aria-invalid');
    });

    const submitBtn = form.querySelector<HTMLButtonElement>('[type="submit"]');
    const originalText = submitBtn?.textContent ?? '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    try {
      const formData = new FormData(form);
      const { data, error } = await (actions[actionKey] as any)(formData);

      if (data?.received) {
        window.location.href = '/thank-you';
        return;
      }

      if (error && isInputError(error)) {
        const fields = error.fields as Record<string, string[] | undefined>;

        Object.entries(fields).forEach(([field, messages]) => {
          if (!messages?.length) return;
          const message = messages[0];

          // Find the matching input/select/textarea
          const input = form.querySelector<HTMLElement>(`[name="${field}"]`);
          if (input) {
            input.setAttribute('aria-invalid', 'true');
          }

          // Find or create the error element
          const errorId = `${field}-error`;
          let errorEl = document.getElementById(errorId);
          if (!errorEl) {
            errorEl = document.createElement('p');
            errorEl.id = errorId;
            errorEl.className = 'field-error';
            errorEl.setAttribute('role', 'alert');
            input?.closest('.form-group')?.appendChild(errorEl);
          }
          errorEl.textContent = message;

          // Link the input to the error element
          if (input) {
            const described = input.getAttribute('aria-describedby') ?? '';
            if (!described.includes(errorId)) {
              input.setAttribute('aria-describedby', `${described} ${errorId}`.trim());
            }
          }
        });

        // Focus the first erroring field
        const firstError = form.querySelector<HTMLElement>('[aria-invalid="true"]');
        firstError?.focus();
      } else if (error) {
        // Unknown server error — show a generic message
        const notice = document.createElement('div');
        notice.className = 'notice notice-error';
        notice.setAttribute('role', 'alert');
        notice.textContent = 'Something went wrong. Please try again or call us directly.';
        form.prepend(notice);
        notice.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } catch {
      const notice = document.createElement('div');
      notice.className = 'notice notice-error';
      notice.setAttribute('role', 'alert');
      notice.textContent = 'Could not send your message. Please check your connection and try again.';
      form.prepend(notice);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
});
