create table questions (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  company text not null,
  job_title text not null,
  date_asked date not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table questions enable row level security;

-- Allow anyone to read
create policy "Public read" on questions for select using (true);

-- Allow anyone to insert
create policy "Public insert" on questions for insert with check (true);
