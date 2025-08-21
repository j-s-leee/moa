create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.raw_app_meta_data is not null then
    if new.raw_app_meta_data ? 'provider' AND new.raw_app_meta_data ->> 'provider' = 'email' then
      insert into public.profiles (profile_id, name, email) values (new.id, 'Anonymous', new.email);
    end if;
    if new.raw_app_meta_data ? 'provider' AND new.raw_app_meta_data ->> 'provider' = 'google' then
      insert into public.profiles (profile_id, name, email) values (new.id, new.raw_user_meta_data ->> 'name', new.email);
    end if;
    if new.raw_app_meta_data ? 'provider' AND new.raw_app_meta_data ->> 'provider' = 'kakao' then
      insert into public.profiles (profile_id, name, email) values (new.id, new.raw_user_meta_data ->> 'preferred_username', new.email);
    end if;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();