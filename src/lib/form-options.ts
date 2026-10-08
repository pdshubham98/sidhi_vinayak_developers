/** Choices shared by the form pages (labels) and the server-side validation (values). */
export type Option = { value: string; label: string };

export const lookingForOptions = [
  { value: 'plot', label: 'A plot' },
  { value: 'farm-house', label: 'A farm house plot' },
  { value: 'house', label: 'A ready house' },
  { value: 'construction', label: 'Construction on my plot' },
  { value: 'other', label: 'Something else' },
] as const satisfies readonly Option[];

export const budgetOptions = [
  { value: 'under-10l', label: 'Under ₹10 Lakh' },
  { value: '10l-25l', label: '₹10 to 25 Lakh' },
  { value: '25l-50l', label: '₹25 to 50 Lakh' },
  { value: '50l-1cr', label: '₹50 Lakh to 1 Cr' },
  { value: 'above-1cr', label: 'Above ₹1 Cr' },
  { value: 'not-sure', label: 'Not sure yet' },
] as const satisfies readonly Option[];

export const timelineOptions = [
  { value: 'now', label: 'As soon as possible' },
  { value: '3-months', label: 'Within 3 months' },
  { value: '6-months', label: 'Within 6 months' },
  { value: 'exploring', label: 'Just exploring' },
] as const satisfies readonly Option[];

export const sellTypeOptions = [
  { value: 'plot', label: 'Plot' },
  { value: 'farm-house', label: 'Farm house or farm land' },
  { value: 'house', label: 'House' },
  { value: 'flat', label: 'Flat' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'agricultural', label: 'Agricultural land' },
  { value: 'other', label: 'Other' },
] as const satisfies readonly Option[];

export const values = <T extends readonly Option[]>(options: T) =>
  options.map((o) => o.value) as unknown as [T[number]['value'], ...T[number]['value'][]];
