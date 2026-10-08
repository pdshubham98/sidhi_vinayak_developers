import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { deliverLead } from '../lib/leads';
import {
  budgetOptions,
  lookingForOptions,
  sellTypeOptions,
  timelineOptions,
  values,
} from '../lib/form-options';

const choose = { error: 'Choose an option' };

// Accepts 10-digit Indian mobile numbers, with or without +91 / 0 and spaces.
const phone = z
  .string()
  .transform((v) => v.replace(/[\s-]/g, ''))
  .pipe(z.string().regex(/^(?:\+?91|0)?[6-9]\d{9}$/, { error: 'Enter a 10-digit mobile number' }));

const optionalText = (max: number) => z.string().trim().max(max, { error: `Keep this under ${max} characters` }).optional();

const contactFields = {
  name: z.string().trim().min(2, { error: 'Enter your name' }).max(80),
  phone,
  email: z.union([z.literal(''), z.email({ error: 'Enter a valid email address, or leave it empty' })]).optional(),
  consent: z.boolean().refine((v) => v, { error: 'Tick the box so we can contact you' }),
  /** Hidden honeypot field: people never fill it, spam bots usually do. */
  website: z.string().optional(),
};

/** Drops the technical fields before the lead is delivered. */
const clean = ({ consent: _c, website: _w, ...rest }: Record<string, unknown>) => rest;

export const server = {
  requirement: defineAction({
    accept: 'form',
    input: z.object({
      ...contactFields,
      lookingFor: z.enum(values(lookingForOptions), choose),
      preferredArea: optionalText(120),
      budget: z.enum(values(budgetOptions), choose),
      timeline: z.enum(values(timelineOptions), choose),
      message: optionalText(1000),
    }),
    handler: async (input) => {
      if (!input.website) await deliverLead('requirement', clean(input));
      return { received: true };
    },
  }),

  sell: defineAction({
    accept: 'form',
    input: z.object({
      ...contactFields,
      propertyType: z.enum(values(sellTypeOptions), choose),
      location: z.string().trim().min(2, { error: 'Enter the property location' }).max(160),
      size: optionalText(80),
      expectedPrice: optionalText(80),
      message: optionalText(1000),
    }),
    handler: async (input) => {
      if (!input.website) await deliverLead('sell', clean(input));
      return { received: true };
    },
  }),

  contact: defineAction({
    accept: 'form',
    input: z.object({
      ...contactFields,
      property: optionalText(120),
      message: z.string().trim().min(5, { error: 'Write a short message' }).max(1000),
    }),
    handler: async (input) => {
      if (!input.website) await deliverLead('contact', clean(input));
      return { received: true };
    },
  }),
};
