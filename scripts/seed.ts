// Seed script — run with: npx tsx scripts/seed.ts
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars

import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(url, service);

async function seed() {
  console.log('Seeding database...');

  // Seed career entries
  const { error: careerError } = await supabase.from('career_entries').upsert(
    [
      {
        title: 'Sales Executive',
        company: 'ABC Corporation',
        period: '2022 - Present',
        description:
          'Managing key client relationships and driving revenue growth through strategic sales initiatives.',
        location: 'Dhaka, Bangladesh',
        order: 1,
      },
      {
        title: 'Sales Associate',
        company: 'XYZ Ltd.',
        period: '2020 - 2022',
        description:
          'Built and maintained client portfolio, exceeded quarterly targets consistently.',
        location: 'Dhaka, Bangladesh',
        order: 2,
      },
      {
        title: 'Intern',
        company: 'Tech Startup',
        period: '2019 - 2020',
        description:
          'Assisted in market research, client outreach, and sales pipeline management.',
        location: 'Dhaka, Bangladesh',
        order: 3,
      },
    ],
    { onConflict: 'id' }
  );

  if (careerError) console.error('Career seed error:', careerError);
  else console.log('  Career entries seeded.');

  // Seed settings
  const { error: settingsError } = await supabase.from('settings').upsert({
    key: 'about',
    value: {
      bio: 'Mohaiminul Islam Meshal is a sales professional and photographer based in Dhaka, Bangladesh. With a passion for building meaningful relationships and capturing authentic moments, he brings a unique blend of interpersonal skills and creative vision to everything he does.',
      skills: [
        'Sales Strategy',
        'Client Relations',
        'Photography',
        'Communication',
        'Negotiation',
        'Leadership',
        'Project Management',
        'Creative Direction',
      ],
      education: [
        {
          degree: 'Bachelor of Business Administration',
          institution: 'University of Dhaka',
          year: '2020',
        },
      ],
    },
  });

  if (settingsError) console.error('Settings seed error:', settingsError);
  else console.log('  Settings seeded.');

  console.log('Done!');
}

seed();
