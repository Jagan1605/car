/*
# Extend cars with colors & trims, add contact fields to orders

1. Modified tables (non-destructive ADD COLUMN only — no drops, no type changes)
- `cars`: add `colors` (jsonb, default []), `trims` (jsonb, default []), `sort_order` (int, default 0).
- `orders`: add `phone` (text, nullable), `shipping_address` (text, nullable), `configured_color` (text, nullable), `configured_trim` (text, nullable).

2. Data updates
- Populate `colors` and `trims` for all 6 existing cars.
- Set `sort_order` ordering for display.

3. Security
- No RLS policy changes. Both tables keep existing anon+authenticated permissive policies.
*/

ALTER TABLE cars ADD COLUMN IF NOT EXISTS colors jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS trims jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS sort_order int NOT NULL DEFAULT 0;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS configured_color text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS configured_trim text;

UPDATE cars SET colors = '[{"name":"Phantom Black","hex":"#0a0a0a"},{"name":"Glacier White","hex":"#f4f4f5"},{"name":"Velocity Red","hex":"#b91c1c"},{"name":"Azure","hex":"#1d4ed8"}]', trims = '[{"name":"Sport","price":0},{"name":"Performance","price":18000},{"name":"Apex","price":42000}]', sort_order = 1 WHERE name = 'Aurora GT-X';
UPDATE cars SET colors = '[{"name":"Stealth Grey","hex":"#374151"},{"name":"Pearl","hex":"#fafafa"},{"name":"Sapphire","hex":"#1e40af"},{"name":"Emerald","hex":"#047857"}]', trims = '[{"name":"Standard","price":0},{"name":"Long Range","price":9000},{"name":"Plaid","price":31000}]', sort_order = 2 WHERE name = 'Nimbus EQ';
UPDATE cars SET colors = '[{"name":"Obsidian","hex":"#111827"},{"name":"Lunar Silver","hex":"#cbd5e1"},{"name":"Forest","hex":"#166534"},{"name":"Sandstorm","hex":"#d6b88c"}]', trims = '[{"name":"Explore","price":0},{"name":"Adventure","price":12000},{"name":"Summit","price":28000}]', sort_order = 3 WHERE name = 'Terra One';
UPDATE cars SET colors = '[{"name":"Carbon Black","hex":"#1c1917"},{"name":"Verona","hex":"#7f1d1d"},{"name":"Miami","hex":"#0ea5e9"},{"name":"Champagne","hex":"#e7c994"}]', trims = '[{"name":"Touring","price":0},{"name":"Track","price":22000},{"name":"Carbon","price":56000}]', sort_order = 4 WHERE name = 'Apex R';
UPDATE cars SET colors = '[{"name":"Graphite","hex":"#1f2937"},{"name":"Glacier","hex":"#f1f5f9"},{"name":"Burgundy","hex":"#7c2d12"},{"name":"Navy","hex":"#1e3a8a"}]', trims = '[{"name":"Executive","price":0},{"name":"Signature","price":11000},{"name":"Prestige","price":26000}]', sort_order = 5 WHERE name = 'Meridian L';
UPDATE cars SET colors = '[{"name":"Blade Silver","hex":"#d1d5db"},{"name":"Inferno","hex":"#dc2626"},{"name":"Midnight","hex":"#0b0b0d"},{"name":"Toxic","hex":"#84cc16"}]', trims = '[{"name":"Sport","price":0},{"name":"Nismo","price":34000},{"name":"LM","price":78000}]', sort_order = 6 WHERE name = 'Vortex RS';
