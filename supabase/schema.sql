-- Run this in the Supabase SQL editor.

create table if not exists products (
  id bigint generated always as identity primary key,
  name text not null,
  description text not null,
  price numeric(10, 2) not null check (price >= 0),
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null,
  address text not null,
  city text not null,
  phone text not null,
  total numeric(10, 2) not null,
  status text not null default 'pending',
  email_sent boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references orders (id) on delete cascade,
  product_id bigint not null references products (id),
  product_name text not null,
  quantity int not null check (quantity > 0),
  unit_price numeric(10, 2) not null
);

alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

drop policy if exists "products are public" on products;
create policy "products are public" on products for select using (true);

drop policy if exists "users read own orders" on orders;
create policy "users read own orders" on orders for select using (auth.uid() = user_id);
drop policy if exists "users create own orders" on orders;
create policy "users create own orders" on orders for insert with check (auth.uid() = user_id);
drop policy if exists "users update own orders" on orders;
create policy "users update own orders" on orders for update using (auth.uid() = user_id);

drop policy if exists "users read own order items" on order_items;
create policy "users read own order items" on order_items for select
  using (exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid()));
drop policy if exists "users create own order items" on order_items;
create policy "users create own order items" on order_items for insert
  with check (exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid()));

insert into products (name, description, price, image_url)
select * from (values
  ('Kraft Tote Bag', 'Reusable, sturdy shopping tote with long handles.', 6500, 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=600&fit=crop'),
  ('Ceramic Mug', 'Classic white 350ml stoneware mug.', 5000, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop'),
  ('Spiral Notebook', 'A4 ruled spiral notebook, 100 pages.', 3500, 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&h=600&fit=crop'),
  ('Potted Cactus', 'Low-maintenance cactus in a terracotta pot.', 8000, 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&h=600&fit=crop'),
  ('Black T-Shirt', 'Heavyweight cotton tee, unisex fit.', 12000, 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&h=600&fit=crop'),
  ('Scented Candle', 'Vanilla soy candle in a glass jar, 40h burn.', 9500, 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=600&fit=crop'),
  ('Water Bottle', 'Insulated steel bottle, keeps drinks cold for 24h.', 15000, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop'),
  ('Wireless Earbuds', 'Compact earbuds with a charging case.', 35000, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop')
) as seed(name, description, price, image_url)
where not exists (select 1 from products);
