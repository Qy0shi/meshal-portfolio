-- Mohaiminul Islam Meshal - portfolio schema (run in Supabase SQL editor)
-- Create public storage buckets: profile, resume (public read for site assets).

-- photos
create table if not exists public.photos (
  id bigint generated always as identity primary key,
  url text not null,
  title text default '',
  category text default 'general',
  width int,
  height int,
  created_at timestamptz default now()
);

alter table public.photos enable row level security;

create policy "photos_public_read" on public.photos for select using (true);

-- career_entries
create table if not exists public.career_entries (
  id bigint generated always as identity primary key,
  title text not null,
  company text not null,
  period text default '',
  description text default '',
  location text default '',
  "order" int default 0,
  created_at timestamptz default now()
);

alter table public.career_entries enable row level security;

create policy "career_public_read" on public.career_entries for select using (true);

-- subscribers (inserts via service role API only)
create table if not exists public.subscribers (
  id bigint generated always as identity primary key,
  email text not null unique,
  created_at timestamptz default now()
);

alter table public.subscribers enable row level security;

-- settings (single row, id = 1)
create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  about jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table public.settings enable row level security;

create policy "settings_public_read" on public.settings for select using (true);

-- Seed settings + sample career (replace with your real data)
insert into public.settings (id, about)
values (
  1,
  '{
    "bio": "Mohaiminul Islam Meshal is a sales professional and photographer based in Dhaka, Bangladesh. He focuses on long-term client relationships and visual storytelling.",
    "skills": ["Sales Strategy", "Client Relations", "Photography", "Negotiation", "CRM", "Public Speaking", "Brand Partnerships"],
    "education": [
      {"degree": "Bachelor of Business Administration", "institution": "University of Dhaka", "year": "2020"}
    ]
  }'::jsonb
)
on conflict (id) do nothing;

insert into public.career_entries (title, company, period, description, location, "order")
values
  (
    'Senior Sales Executive',
    'Leading FMCG / Retail (example)',
    '2022 - Present',
    'Owns pipeline, key accounts, and revenue targets; collaborates with marketing on campaigns and trade visibility.',
    'Dhaka, Bangladesh',
    1
  ),
  (
    'Sales & Business Development',
    'Regional distributor (example)',
    '2019 - 2022',
    'Built distributor relationships, negotiated terms, and supported field teams with training and reporting.',
    'Dhaka, Bangladesh',
    2
  ),
  (
    'Freelance Photographer',
    'Independent',
    '2018 - Present',
    'Events, portraits, and brand content; end-to-end from shoot to delivery.',
    'Bangladesh',
    3
  );

-- Optional: add hero/gallery rows after uploading files to storage:
-- insert into public.photos (url, title, category) values
--   ('https://YOUR_PROJECT.supabase.co/storage/v1/object/public/gallery/hero1.jpg', 'Dhaka', 'hero');
