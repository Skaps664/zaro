create table if not exists public.admin_products (
  id text primary key,
  name text not null,
  inspired_by text not null,
  category text not null,
  audience text not null check (audience in ('Male', 'Female', 'Unisex')),
  notes text[] not null default '{}',
  description text not null,
  longevity text not null,
  projection text not null,
  best_for text not null,
  time text not null,
  image text not null,
  images text[] not null default '{}',
  video_embed_url text,
  price numeric(10, 2) not null default 3490,
  is_hero boolean not null default false,
  hide_on_all_products boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id integer primary key,
  hero_image_url text not null default '/zaru-hero-2.png',
  banner_image_1 text not null default '/sope.jpg',
  banner_image_2 text not null default '/images/mission-luxury-scent.jpg',
  hero_title_line1 text not null default 'Premium Fragrance',
  hero_title_line2 text not null default 'Perfected for You',
  hero_subtitle text not null default 'High-accuracy fragrance impressions with enhanced longevity. Luxury at a smart price point.',
  hero_products_eyebrow text not null default 'Hero Fragrances',
  hero_products_title text not null default 'Scents crafted with precision',
  hero_products_subtitle text not null default 'Experience luxury without compromise.',
  video_reviews_heading text not null default 'Video Reviews',
  video_reviews_subheading text not null default 'Here''s what our customer think about our products',
  video_reviews jsonb not null default '[]'::jsonb,
  spotlight_title text not null default 'Crafted for presence, designed for everyday wear',
  spotlight_subtitle text not null default 'Inside ZARU',
  spotlight_paragraph_1 text not null default 'Every bottle is blended to capture the spirit of iconic fragrances while staying wearable, modern, and distinctly yours.',
  spotlight_paragraph_2 text not null default 'From first spray to dry-down, ZARU balances richness and clarity so your scent feels premium from morning to night.',
  mission_eyebrow text not null default 'Our Mission',
  mission_title text not null default 'Luxury without compromise',
  mission_paragraph text not null default 'At ZARU, we''re redefining what luxury fragrance means. We believe premium quality shouldn''t require a premium price tag. Every fragrance is meticulously crafted to deliver the same emotional experience, accuracy, and longevity as designer scents.',
  mission_cta text not null default 'Start exploring',
  products_page_title text not null default 'All 14 ZARU Fragrances',
  products_page_description text not null default 'Original-like scents. Stronger performance. Smarter price.',
  hero_product_ids text[] not null default '{}'
);

insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

alter table public.admin_products add column if not exists images text[] not null default '{}';
alter table public.admin_products add column if not exists hide_on_all_products boolean not null default false;
alter table public.site_settings add column if not exists banner_image_1 text not null default '/sope.jpg';
alter table public.site_settings add column if not exists banner_image_2 text not null default '/images/mission-luxury-scent.jpg';
alter table public.site_settings add column if not exists hero_products_eyebrow text not null default 'Hero Fragrances';
alter table public.site_settings add column if not exists hero_products_title text not null default 'Scents crafted with precision';
alter table public.site_settings add column if not exists hero_products_subtitle text not null default 'Experience luxury without compromise.';
alter table public.site_settings add column if not exists video_reviews_heading text not null default 'Video Reviews';
alter table public.site_settings add column if not exists video_reviews_subheading text not null default 'Here''s what our customer think about our products';
alter table public.site_settings add column if not exists video_reviews jsonb not null default '[]'::jsonb;
alter table public.site_settings add column if not exists spotlight_title text not null default 'Crafted for presence, designed for everyday wear';
alter table public.site_settings add column if not exists spotlight_subtitle text not null default 'Inside ZARU';
alter table public.site_settings add column if not exists spotlight_paragraph_1 text not null default 'Every bottle is blended to capture the spirit of iconic fragrances while staying wearable, modern, and distinctly yours.';
alter table public.site_settings add column if not exists spotlight_paragraph_2 text not null default 'From first spray to dry-down, ZARU balances richness and clarity so your scent feels premium from morning to night.';
alter table public.site_settings add column if not exists mission_eyebrow text not null default 'Our Mission';
alter table public.site_settings add column if not exists mission_title text not null default 'Luxury without compromise';
alter table public.site_settings add column if not exists mission_paragraph text not null default 'At ZARU, we''re redefining what luxury fragrance means. We believe premium quality shouldn''t require a premium price tag. Every fragrance is meticulously crafted to deliver the same emotional experience, accuracy, and longevity as designer scents.';
alter table public.site_settings add column if not exists mission_cta text not null default 'Start exploring';

insert into storage.buckets (id, name, public)
values ('zaru-assets', 'zaru-assets', true)
on conflict (id) do nothing;

create table if not exists public.customer_orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique,
  customer_name text not null,
  customer_phone text not null,
  customer_city text not null,
  customer_address text not null,
  customer_email text,
  payment_type text not null default 'advance',
  payment_method text not null,
  payment_reference text,
  subtotal_amount numeric(10, 2) not null default 0,
  discount_amount numeric(10, 2) not null default 0,
  payable_amount numeric(10, 2) not null default 0,
  total_items integer not null default 0,
  items jsonb not null,
  status text not null default 'pending',
  payment_status text not null default 'unpaid',
  tracking_info text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_products enable row level security;
alter table public.site_settings enable row level security;
alter table public.customer_orders enable row level security;

grant select on table public.admin_products to anon, authenticated;
grant select on table public.site_settings to anon, authenticated;
grant insert on table public.customer_orders to anon, authenticated;

drop policy if exists "Public can read products" on public.admin_products;
create policy "Public can read products"
  on public.admin_products
  for select
  using (true);

drop policy if exists "Public can read settings" on public.site_settings;
create policy "Public can read settings"
  on public.site_settings
  for select
  using (true);

drop policy if exists "Public can create checkout orders" on public.customer_orders;
create policy "Public can create checkout orders"
  on public.customer_orders
  for insert
  with check (true);
