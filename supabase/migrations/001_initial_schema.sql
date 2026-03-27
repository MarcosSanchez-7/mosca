-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Categories
create table categories (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  slug       text not null unique,
  subtitle   text,
  image_url  text,
  created_at timestamptz default now()
);

-- Products
create table products (
  id             uuid primary key default uuid_generate_v4(),
  name           text not null,
  slug           text not null unique,
  description    text,
  price          numeric(12, 2) not null,
  old_price      numeric(12, 2),
  image_url      text,
  images         jsonb default '[]'::jsonb,
  badge          text check (badge in ('new', 'sale', 'limited', 'imported', null)),
  rating         numeric(3, 1) default 0.0,
  reviews_count  integer default 0,
  category_id    uuid references categories(id) on delete set null,
  specs          jsonb default '{}'::jsonb,
  is_featured    boolean default false,
  created_at     timestamptz default now()
);

-- Performance indexes
create index idx_products_category_id on products(category_id);
create index idx_products_slug        on products(slug);
create index idx_products_featured    on products(is_featured) where is_featured = true;
create index idx_categories_slug      on categories(slug);

-- Row Level Security (public read-only)
alter table categories enable row level security;
alter table products   enable row level security;

create policy "Public read categories"
  on categories for select using (true);

create policy "Public read products"
  on products for select using (true);
