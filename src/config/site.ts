/**
 * Business details used across the whole website (header, footer, contact page, SEO).
 * Change a value here and it updates everywhere.
 *
 * Contact fields left empty are hidden on the site (no broken call/WhatsApp buttons).
 */
export const site = {
  name: 'Siddhivinayak Developers',
  tagline: 'Plots, farm houses and home construction around Bhopal',
  description:
    'Buy plots and farm houses, build your house, or sell your property around Bhopal. Visit Vatika Green near Bilkisganj or our office in Neelbad.',

  /** Keep false until the site is live on its own domain, so search engines don't index the temporary address. */
  indexable: false,

  contact: {
    /** Shown as text and used for tap-to-call, e.g. '+91 98765 43210'. */
    phone: '+91 98765 43210',       // TODO: replace with real number
    /** WhatsApp number with country code, digits only, e.g. '919876543210'. */
    whatsapp: '919876543210',       // TODO: replace with real number
    email: 'info@siddhivinayak.in', // TODO: replace with real email
    /** e.g. 'Mon to Sat, 10 am to 7 pm' */
    hours: 'Mon to Sat, 10 am to 7 pm',
  },

  office: {
    label: 'Office',
    lines: ['Plot No. 31, AM Point', 'Near Durga Mandir, Neelbad', 'Bhopal, Madhya Pradesh 462044'],
    /** Google Maps share link for the office. */
    mapUrl: '',
  },

  projectSite: {
    label: 'Vatika Green site',
    lines: ['Vatika Green Parisar', 'Khuraniya, near Bilkisganj'],
    /** Google Maps share link for the site. */
    mapUrl: '',
  },
};

const digits = (value: string) => value.replace(/\D/g, '');

/** Builds a tel: link; assumes an Indian number when no country code is given. */
export const telHref = (phone: string) => {
  const d = digits(phone).replace(/^0+/, '');
  return `tel:+${d.length === 10 ? `91${d}` : d}`;
};

export const whatsappHref = (number: string, message?: string) =>
  `https://wa.me/${digits(number)}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
