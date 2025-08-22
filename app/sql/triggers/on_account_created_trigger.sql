create or replace function public.handle_new_account()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.created_by is not null then
    insert into public.account_members (account_id, profile_id, role) values (new.account_id, new.created_by, 'owner');
  end if;
  return new;
end;
$$;

create trigger on_account_created
after insert on public.accounts
for each row
execute procedure public.handle_new_account();