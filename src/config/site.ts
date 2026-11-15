/**
 * Business details used across the whole website (header, footer, contact page, SEO).
 * Change a value here and it updates everywhere.
 *
 * Contact fields left empty are hidden on the site (no broken call/WhatsApp buttons).
 */
export const site = {
  name: 'Sidhivinayak Developers',
  tagline: 'Buy It. Build It. Sell It. We\'re With You.',
  description:
    'Explore residential plots and farmhouses near Bhopal, plan your home construction, or enquire about selling your property with Sidhivinayak Developers.',

  /** Controlled by SITE_INDEXABLE env var — set to 'true' in Cloudflare dashboard to enable indexing. */
  indexable: import.meta.env.SITE_INDEXABLE === 'true',

  contact: {
    /** Shown as text and used for tap-to-call, e.g. '+91 98765 43210'. */
    phone: '+91 78692 46638',
    /** WhatsApp number with country code, digits only, e.g. '919876543210'. */
    whatsapp: '917869246638',
    email: 'sales.siddhivinayakdevelopers@gmail.com',
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
