create table if not exists public.dining_schedule (
  id uuid primary key default gen_random_uuid(),
  meal_type text not null, -- Breakfast, Lunch, Dinner
  time text not null,
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.dining_schedule enable row level security;

-- Allow anyone to read (website visitors)
do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'dining_schedule' and policyname = 'Allow read to all') then
    create policy "Allow read to all" on public.dining_schedule
      for select
      using (true);
  end if;
end $$;

-- Only authenticated admins can insert/update/delete
do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'dining_schedule' and policyname = 'Only admins can insert') then
    create policy "Only admins can insert" on public.dining_schedule
      for insert
      with check (has_role('admin', auth.uid()));
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'dining_schedule' and policyname = 'Only admins can update') then
    create policy "Only admins can update" on public.dining_schedule
      for update
      using (has_role('admin', auth.uid()))
      with check (has_role('admin', auth.uid()));
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'dining_schedule' and policyname = 'Only admins can delete') then
    create policy "Only admins can delete" on public.dining_schedule
      for delete
      using (has_role('admin', auth.uid()));
  end if;
end $$;

-- Updated at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_dining_schedule_updated_at on public.dining_schedule;
create trigger trg_dining_schedule_updated_at
before update on public.dining_schedule
for each row execute function public.set_updated_at();
