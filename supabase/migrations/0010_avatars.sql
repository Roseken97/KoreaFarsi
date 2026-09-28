-- Preset avatar picker (Account → Edit Profile). No photo upload — just a
-- named choice from a small fixed set defined in src/lib/avatars.ts.
alter table public.profiles
  add column if not exists avatar_key text;
