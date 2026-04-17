-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create resumes table
create table public.resumes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text default 'My Resume' not null,
  content jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table public.resumes enable row level security;

-- Create policies
create policy "Users can view their own resumes"
  on public.resumes for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own resumes"
  on public.resumes for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own resumes"
  on public.resumes for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own resumes"
  on public.resumes for delete
  using ( auth.uid() = user_id );

-- Function to handle updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for updated_at
create trigger handle_updated_at
  before update on public.resumes
  for each row
  execute function public.handle_updated_at();
