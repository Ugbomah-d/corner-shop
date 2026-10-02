-- Run once in the Supabase SQL editor: switches prices to naira and fixes product photos.

update products set name = 'Kraft Tote Bag', description = 'Reusable, sturdy shopping tote with long handles.',
  price = 6500, image_url = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=600&fit=crop' where id = 1;
update products set name = 'Ceramic Mug', description = 'Classic white 350ml stoneware mug.',
  price = 5000, image_url = 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop' where id = 2;
update products set name = 'Spiral Notebook', description = 'A4 ruled spiral notebook, 100 pages.',
  price = 3500, image_url = 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&h=600&fit=crop' where id = 3;
update products set name = 'Potted Cactus', description = 'Low-maintenance cactus in a terracotta pot.',
  price = 8000, image_url = 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&h=600&fit=crop' where id = 4;
update products set name = 'Black T-Shirt', description = 'Heavyweight cotton tee, unisex fit.',
  price = 12000, image_url = 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&h=600&fit=crop' where id = 5;
update products set name = 'Scented Candle', description = 'Vanilla soy candle in a glass jar, 40h burn.',
  price = 9500, image_url = 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=600&fit=crop' where id = 6;
update products set name = 'Water Bottle', description = 'Insulated steel bottle, keeps drinks cold for 24h.',
  price = 15000, image_url = 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop' where id = 7;
update products set name = 'Wireless Earbuds', description = 'Compact earbuds with a charging case.',
  price = 35000, image_url = 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop' where id = 8;
