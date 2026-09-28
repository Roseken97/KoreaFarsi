-- Phase 2, Part 3: in-app admin uploads (Products panel).
-- Creates the two Storage buckets by SQL instead of the manual dashboard
-- steps in README.md, so a fresh Supabase project is fully set up by running
-- migrations alone. Safe to re-run.

insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('library', 'library', false)
on conflict (id) do nothing;

-- Public bucket: Storage already serves objects anonymously via the public
-- URL endpoint, so no read policy is needed here. Both buckets are written
-- to only by the service-role client from /admin/products (see
-- src/lib/products/admin-actions.ts), so no insert/update/delete policy is
-- needed either — the service role bypasses RLS entirely.
