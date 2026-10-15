/**
 * Frequently asked questions (shown on /faq and used for Google's FAQ markup).
 * Edit the text between the quotes. Keep the quotes and the commas.
 * The insurance and paint-brand answers use your settings from src/config/site.ts.
 */
import { site } from '../config/site';
import { joinList } from '../lib/utils';

export const faqs: { q: string; a: string }[] = [
  {
    q: 'How does flat-rate pricing work?',
    a: 'After you tell us about your rooms and send a few photos, we give you one written price for the entire job. It covers prep, paint, labor and clean-up. You are not billed by the hour, so the price does not change if the work takes longer than expected. If you decide to add to the scope, we agree on the new price before we do the extra work.',
  },
  {
    q: 'How do I get a quote?',
    a: `Fill out the quote form, call us, or email us with the rooms you want painted. Photos help us price accurately. We reply within ${site.replyTime}, and for some jobs we will ask to see the space before giving you a final price.`,
  },
  {
    q: 'How long will my painting job take?',
    a: 'It depends on the size of the space and how much prep it needs. A single room is often finished in a day or two, and a full apartment typically takes several days. We give you a start date and an expected finish date when you accept your quote.',
  },
  {
    q: 'Do I need to move my furniture?',
    a: 'No. We move furniture to the center of the room, cover it, and protect your floors before we start, then put everything back when we are done. If you have fragile or valuable items, we recommend moving them out of the room first.',
  },
  {
    q: 'How do you prepare the walls?',
    a: 'We patch holes and dents, sand rough areas, caulk gaps along trim, and prime repairs and stained spots. Prep is where a paint job succeeds or fails, and it is included in your flat-rate price.',
  },
  {
    q: 'What paint brands do you use?',
    a: `${site.trust.paintBrands ? `We use professional-quality paints from brands such as ${site.trust.paintBrands}.` : 'We use professional-quality paints chosen for each surface and room.'} If you have a specific brand or color in mind, tell us and we will price it into your quote. We can also recommend finishes for each surface, from flat on ceilings to semi-gloss on trim.`,
  },
  // Only listed once trust.insured is set to true in src/config/site.ts.
  ...(site.trust.insured
    ? [
        {
          q: 'Are you insured?',
          a: 'Yes. We carry liability insurance on every job, and we can provide proof of coverage if your building or landlord asks for it.',
        },
      ]
    : []),
  {
    q: 'Can you paint in a co-op or condo building?',
    a: 'Yes. Many NYC buildings have rules for contractors, such as approved work hours, elevator reservations and protection for common areas. Tell us about your building when you request a quote and we will plan around its requirements.',
  },
  {
    q: 'Can I stay home while you paint?',
    a: 'Most customers do. We work one room at a time, keep paint and tools contained, and clean up at the end of each day. If you are sensitive to paint odors, ask us about low-odor paint options.',
  },
  {
    q: 'Which areas do you serve?',
    a: `We paint in ${site.areaSummary}: ${joinList(site.regions)}. See our service areas page for the neighborhoods we work in most often. If you are not sure whether we cover your address, ask us.`,
  },
  {
    q: 'Do you paint commercial spaces?',
    a: 'Yes, light commercial work such as offices and retail spaces. We schedule around your business hours and your landlord’s rules to keep disruption to a minimum.',
  },
];
