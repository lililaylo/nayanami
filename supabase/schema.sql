create table orders (
  id text primary key,
  created_at timestamptz default now(),
  customer_name text not null,
  phone text not null,
  address text not null,
  items jsonb not null,
  total integer not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'fulfilled', 'cancelled'))
);

alter table orders enable row level security;

-- Customers can insert orders
create policy "Anyone can insert orders"
  on orders for insert
  with check (true);

-- Only service role (admin) can read and update
create policy "Service role can select"
  on orders for select
  using (auth.role() = 'service_role');

create policy "Service role can update"
  on orders for update
  using (auth.role() = 'service_role');
