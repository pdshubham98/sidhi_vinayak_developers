/**
 * Single place where form submissions ("leads") are delivered.
 *
 * Local development: each lead is printed to the terminal running `npm run dev`.
 * When APPS_SCRIPT_URL is set: data is also POSTed to Google Sheets via Apps Script.
 */
export type LeadForm = 'requirement' | 'sell' | 'contact';

export interface Lead {
  form: LeadForm;
  submittedAt: string;
  data: Record<string, unknown>;
}

export async function deliverLead(form: LeadForm, data: Record<string, unknown>): Promise<void> {
  const lead: Lead = { form, submittedAt: new Date().toISOString(), data };
  console.info(`[lead] ${JSON.stringify(lead)}`);

  const scriptUrl = import.meta.env.APPS_SCRIPT_URL;
  if (scriptUrl) {
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formType: form, ...data }),
      });
    } catch {
      // Non-fatal — lead is already logged above
    }
  }
}
