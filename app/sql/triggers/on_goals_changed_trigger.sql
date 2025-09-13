create or replace function public.handle_goals_changed()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    update public.accounts set total_savings = total_savings + new.monthly_savings where account_id = new.account_id;
  elsif tg_op = 'DELETE' then
    update public.accounts set total_savings = total_savings - old.monthly_savings where account_id = old.account_id;
  end if;
  return new;
end;
$$;

create trigger on_goals_changed
after insert or delete on public.goals
for each row
execute procedure public.handle_goals_changed();