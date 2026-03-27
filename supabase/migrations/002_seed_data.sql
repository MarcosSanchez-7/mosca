-- Seed categories
insert into categories (name, slug, subtitle, image_url) values
  ('Notebooks',   'notebooks',   'Portátiles de alto rendimiento', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'),
  ('Smartphones', 'smartphones', 'Conectividad sin límites',       'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'),
  ('Hardware',    'hardware',    'Componentes y periféricos',      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800'),
  ('Accesorios',  'accesorios',  'Complementos esenciales',        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800');

-- Seed products
do $$
declare
  cat_nb  uuid;
  cat_sp  uuid;
  cat_hw  uuid;
  cat_ac  uuid;
begin
  select id into cat_nb from categories where slug = 'notebooks';
  select id into cat_sp from categories where slug = 'smartphones';
  select id into cat_hw from categories where slug = 'hardware';
  select id into cat_ac from categories where slug = 'accesorios';

  insert into products
    (name, slug, description, price, old_price, image_url, images, badge, rating, reviews_count, category_id, specs, is_featured)
  values
  (
    'MacBook Pro M3 Pro 14"',
    'macbook-pro-m3-pro-14',
    'El portátil profesional de Apple con chip M3 Pro de 11 núcleos para flujos de trabajo exigentes.',
    2499000, 2799000,
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
    '["https://images.unsplash.com/photo-1611186871525-63c7a4d7b92a?w=800"]'::jsonb,
    'imported', 4.9, 127, cat_nb,
    '{"procesador":"Apple M3 Pro 11 núcleos","ram":"18 GB unificada","almacenamiento":"512 GB SSD","pantalla":"14.2\" Liquid Retina XDR","batería":"Hasta 18 horas","peso":"1.61 kg"}'::jsonb,
    true
  ),
  (
    'Dell XPS 15 9530',
    'dell-xps-15-9530',
    'Pantalla OLED de 15.6" con Intel Core i9 y RTX 4070 para creadores de contenido exigentes.',
    1899000, null,
    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800',
    '[]'::jsonb,
    'new', 4.7, 84, cat_nb,
    '{"procesador":"Intel Core i9-13900H","ram":"32 GB DDR5","almacenamiento":"1 TB SSD NVMe","pantalla":"15.6\" OLED 3.5K","gpu":"NVIDIA RTX 4070 8GB","peso":"1.86 kg"}'::jsonb,
    true
  ),
  (
    'iPhone 15 Pro Max 256GB',
    'iphone-15-pro-max-256gb',
    'Titanio. Cámara pro de 48 MP. Chip A17 Pro. El smartphone más avanzado de Apple.',
    1349000, 1499000,
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
    '[]'::jsonb,
    'sale', 4.9, 312, cat_sp,
    '{"procesador":"Apple A17 Pro","pantalla":"6.7\" Super Retina XDR OLED","cámara":"48MP + 12MP + 12MP","batería":"4422 mAh","almacenamiento":"256 GB","5G":"Sí"}'::jsonb,
    true
  ),
  (
    'Samsung Galaxy S24 Ultra',
    'samsung-galaxy-s24-ultra',
    'Pantalla Dynamic AMOLED 2X de 6.8" con S Pen integrado y cámara de 200 MP.',
    1199000, null,
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
    '[]'::jsonb,
    'imported', 4.8, 198, cat_sp,
    '{"procesador":"Snapdragon 8 Gen 3","pantalla":"6.8\" Dynamic AMOLED 2X","cámara":"200MP + 12MP + 50MP + 10MP","batería":"5000 mAh","almacenamiento":"256 GB","s_pen":"Integrado"}'::jsonb,
    true
  ),
  (
    'NVIDIA RTX 4080 Super 16GB',
    'nvidia-rtx-4080-super-16gb',
    'GPU de referencia para gaming 4K y renderizado profesional con arquitectura Ada Lovelace.',
    899000, 999000,
    'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800',
    '[]'::jsonb,
    'limited', 4.9, 56, cat_hw,
    '{"arquitectura":"Ada Lovelace","vram":"16 GB GDDR6X","tdp":"320W","puertos":"3x DP 1.4a + HDMI 2.1","pcie":"PCIe 4.0 x16"}'::jsonb,
    true
  ),
  (
    'Logitech MX Master 3S',
    'logitech-mx-master-3s',
    'El mouse de productividad definitivo con scroll electromagnético y sensor de 8000 DPI.',
    89000, null,
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800',
    '[]'::jsonb,
    'new', 4.8, 445, cat_ac,
    '{"sensor":"Darkfield 8000 DPI","conexión":"USB-C / Bluetooth / Unifying","batería":"70 días","compatibilidad":"Windows / macOS / Linux","peso":"141g"}'::jsonb,
    false
  );
end $$;
