-- Add support for custom avatar image uploads (in addition to preset avatars)
alter table profiles
  add column if not exists custom_avatar_url text;

-- Create storage bucket for profile avatars if it doesn't exist
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Set up RLS policies for avatar bucket
create policy "Avatar images are publicly readable" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Users can upload their own avatar" on storage.objects
  for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can update their own avatar" on storage.objects
  for update
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own avatar" on storage.objects
  for delete
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
