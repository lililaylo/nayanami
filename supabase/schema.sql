create table orders (
  id text primary key,
  created_at timestamptz default now(),
  customer_name text not null,
  phone text not null,
  address text not null,
  social text,
  delivery_type text not null default 'now' check (delivery_type in ('now', 'scheduled')),
  delivery_date text,
  delivery_time text,
  items jsonb not null,
  total integer not null,
  delivery_fee integer,
  status text default 'pending' check (status in ('pending', 'confirmed', 'fulfilled', 'cancelled')),
  payment_status text default 'unpaid' check (payment_status in ('unpaid', 'paid', 'failed')),
  paymongo_session_id text
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
