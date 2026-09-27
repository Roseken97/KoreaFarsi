-- Milestone 2: let a user create their own profile row (Edit Profile uses upsert,
-- covering accounts created before the 0001 trigger existed).
create policy "profiles: owner can insert"
  on public.profiles for insert
  with check (auth.uid() = id);
