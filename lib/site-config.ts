/**
 * SITE CONFIG — every piece of business identity lives here.
 * Rebranding this demo for a real electrical contractor is a ONE-FILE edit:
 * change these values, swap the logo/footage, done.
 */

export const SITE = {
  // DEMO — fictional business. All names, numbers, and towns are placeholders.
  name: 'VoltCrest Electric',
  legalName: 'VoltCrest Electric Co.', // DEMO
  tagline: 'We Bring the Power Back',
  description:
    'Licensed electricians serving the Greater Metro Area. Panel upgrades, EV chargers, rewiring, and 24/7 emergency service — power restored, done right.',

  phone: '(555) 010-0110', // DEMO — reserved fictional number
  phoneHref: 'tel:+15550100110',
  email: 'service@voltcrestelectric.example', // DEMO

  yearsInBusiness: 20, // DEMO
  licenseNumber: 'EC-217403', // DEMO
  license: 'License #EC-217403 — Licensed, Bonded & Insured', // DEMO

  reviewRating: '4.9', // DEMO
  reviewCount: 'Hundreds', // DEMO

  serviceArea: {
    region: 'Greater Metro Area', // DEMO
    headline: 'Proudly Serving the Greater Metro Area',
    city: 'Fairview', // DEMO — the hub city
    towns: [
      'Cedar Falls',
      'Maplewood',
      'Riverton',
      'Oak Grove',
      'Lakeside',
      'Brookfield',
      'Ashland',
    ], // DEMO — plausible surrounding communities
    radiusNote: 'Not sure if you’re in our service area? Give us a call — if we can reach you, we can help you.',
  },

  hours: {
    weekday: 'Mon–Fri: 7:00 AM – 6:00 PM',
    saturday: 'Sat: 8:00 AM – 4:00 PM',
    emergency: '24/7 Emergency Service — every day of the year',
  },

  // DEMO credit — connects the demo back to Fifth Ave AI without branding the site.
  credit: {
    text: 'A demo build by Fifth Ave AI — custom contractor websites with AI-powered features.',
    href: 'https://fifthaveai.com',
  },
} as const;

export type SiteConfig = typeof SITE;
