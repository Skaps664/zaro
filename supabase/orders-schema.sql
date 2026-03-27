create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  items jsonb not null,
  total_items integer not null default 0,
  total_amount numeric(10, 2) not null default 0,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;
grant select, insert on table public.orders to authenticated;

drop policy if exists "Users can read own orders" on public.orders;
create policy "Users can read own orders"
  on public.orders
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own orders" on public.orders;
create policy "Users can insert own orders"
  on public.orders
  for insert
  with check (auth.uid() = user_id);
