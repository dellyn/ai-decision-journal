-- Create decisions table
create table if not exists public.decisions (
    "id" uuid default gen_random_uuid() primary key,
    "userId" uuid references auth.users(id) on delete cascade not null,
    "situation" text not null,
    "decision" text not null,
    "reasoning" text,
    "status" text not null check ("status" in ('pending', 'processing', 'done', 'error')),
    "analysis" jsonb,
    "createdAt" timestamp with time zone default timezone('utc'::text, now()) not null,
    "updatedAt" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index on userId for faster lookups
create index if not exists decisions_user_id_idx on public.decisions("userId");

-- Create index on createdAt for faster sorting
create index if not exists decisions_created_at_idx on public.decisions("createdAt" desc);

-- Enable Row Level Security (RLS)
alter table public.decisions enable row level security;

-- Create policy to allow users to view only their own decisions
create policy "Users can view their own decisions"
    on public.decisions
    for select
    using (auth.uid() = "userId");

-- Create policy to allow users to insert their own decisions
create policy "Users can insert their own decisions"
    on public.decisions
    for insert
    with check (auth.uid() = "userId");

-- Create policy to allow users to update their own decisions
create policy "Users can update their own decisions"
    on public.decisions
    for update
    using (auth.uid() = "userId");

-- Create function to automatically update updatedAt timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new."updatedAt" = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updatedAt timestamp
create trigger set_updated_at
    before update on public.decisions
    for each row
    execute function public.handle_updated_at(); 