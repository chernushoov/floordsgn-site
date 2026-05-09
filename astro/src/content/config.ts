import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const i18nString = z.object({
  ru: z.string(),
  en: z.string(),
  he: z.string().optional().default(''),
  ar: z.string().optional().default(''),
});

const i18nStringRequired = z.object({
  ru: z.string().min(1),
  en: z.string().min(1),
  he: z.string().optional().default(''),
  ar: z.string().optional().default(''),
});

const sourceItem = z.object({
  type: z.enum(['vendor-tds', 'standard', 'peer-reviewed', 'internal-project', 'vendor-blog']),
  vendor: z.string().optional(),
  doc: z.string().optional(),
  url: z.string().url().optional(),
  authority: z.string().optional(),
  retrieved: z.string(),
});

const installationStep = z.object({
  name: z.string(),
  purpose: z.string(),
  time_h: z.number().optional(),
  consumables_kg_m2: z.number().optional(),
});

const pitfall = z.object({
  name: z.string(),
  cause: z.string(),
  fix: z.string(),
  photo: z.string().optional(),
});

const alternative = z.object({
  slug: z.string(),
  when: z.string(),
});

const faqItem = z.object({
  q: i18nString,
  a: i18nString,
});

const materials = defineCollection({
  loader: glob({
    pattern: '**/*.yaml',
    base: '../encyclopedia/materials',
  }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    family: z.enum([
      'polished-concrete',
      'epoxy',
      'terrazzo',
      'pu-mma',
      'microcement',
      'cement-screed',
      'industrial-self-leveling',
      'parquet-engineered',
      'laminate-lvt-spc',
    ]),
    draft_status: z.enum(['draft', 'in-review', 'published', 'archived']).default('draft'),
    audience_tag: z.enum(['contractor', 'architect', 'owner', 'diy']).optional(),
    source_priority: z.number().int().min(1).max(5).optional(),

    display_name: i18nStringRequired,
    one_liner: i18nStringRequired,

    what_is_it: i18nStringRequired,
    composition: z.array(z.string()).min(1),
    thickness_mm: z.tuple([z.number(), z.number()]),
    service_life_years: z.tuple([z.number().int(), z.number().int()]),

    price_ils_m2: z.object({
      range: z.tuple([z.number(), z.number()]),
      includes: z.array(z.string()),
      excludes: z.array(z.string()),
      notes: z.string().optional(),
      last_priced: z.string().optional(),
    }),

    fit: z.object({
      good: z.array(z.string()).min(2),
      bad: z.array(z.string()).min(1),
      why: i18nStringRequired,
    }),

    installation: z.object({
      substrate_requirements: z.array(z.string()),
      steps: z.array(installationStep).min(2),
      typical_time_days: z.number(),
      crew_size: z.number().int(),
      cure_walk_h: z.number().optional(),
      cure_load_h: z.number().optional(),
      cure_full_days: z.number().int().optional(),
    }),

    pitfalls: z.array(pitfall).min(2),
    alternatives: z.array(alternative).min(2),

    cross_section_svg: z.string().optional(),
    hero_photo: z.string().optional(),
    photos: z.array(z.string()).default([]),

    sources: z.array(sourceItem).min(1),

    related: z.array(z.string()).default([]),
    faq: z.array(faqItem).default([]),

    last_reviewed: z.string(),
    reviewer: z.string(),
  }),
});

export const collections = { materials };
