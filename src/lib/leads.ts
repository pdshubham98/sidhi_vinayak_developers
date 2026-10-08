/**
 * Single place where form submissions ("leads") are delivered.
 *
 * Local development: each lead is printed to the terminal running `npm run dev`.
 * Go-live: this function also saves the lead in the CMS and sends an email notification,
 * without any change to the forms or pages.
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
}
