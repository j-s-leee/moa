create or replace function public.handle_new_invitation_accept()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.invitation_id is not null and exists (select 1 from public.invitations where invitation_id = new.invitation_id) then
    update public.invitations set used_count = used_count + 1 where invitation_id = new.invitation_id;
    if (select used_count from public.invitations where invitation_id = new.invitation_id) >= (select max_uses from public.invitations where invitation_id = new.invitation_id) then
      update public.invitations set status = 'consumed' where invitation_id = new.invitation_id;
    end if;
    if new.profile_id is not null then
      insert into public.account_members (account_id, profile_id, role) values (new.account_id, new.profile_id, 'member');
    end if;
  end if;
  return new;
end;
$$;

create trigger on_invitation_accepts_created
after insert on public.invitation_accepts
for each row
execute procedure public.handle_new_invitation_accept();